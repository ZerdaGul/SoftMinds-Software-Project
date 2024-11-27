using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using api.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;
using api.Models;
using System.Security.Claims;
using api.DTO;
using Microsoft.AspNetCore.Authorization;

namespace api.Controller
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly ILogger<ProductsController> _logger;


        public ProductsController(AppDBContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string sector = "all",
            [FromQuery] string sortOrder = "asc",
            [FromQuery] string sortBy = "name",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int itemsPerPage = 21)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(sector) && sector.ToLower() != "all")
            {
                query = query.Where(p => p.Sector == sector);
            }

            switch (sortBy.ToLower())
            {
                case "price":
                    query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price);
                    break;
                case "popularity":
                    query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock); // Assuming Stock represents popularity
                    break;
                case "name":
                default:
                    query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name);
                    break;
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)itemsPerPage);

            var products = await query
                .Skip((pageNumber - 1) * itemsPerPage)
                .Take(itemsPerPage)
                .ToListAsync();

            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                ItemsPerPage = itemsPerPage,
                Products = products
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var stopwatch = Stopwatch.StartNew();

            _logger.LogInformation("Product detail page visited for product ID: {ProductId}", id);

            var product = await _context.Products
                .Include(p => p.Comments)
                .Include(p => p.Reviews) // Include reviews
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                _logger.LogWarning("Product with ID: {ProductId} not found", id);
                return NotFound();
            }

            var response = new
            {
                product.Name,
                product.Price,
                product.Description,
                product.Stock,
                product.Sector,
                Availability = product.Stock > 0 ? "In Stock" : "Out of Stock", // Check stock status
                Comments = product.Comments.Select(c => new { c.Text, c.Created_At }),
                Reviews = product.Reviews.Select(r => new { r.Rating, r.ReviewText }) // Include reviews in response
            };

            stopwatch.Stop();
            _logger.LogInformation("Product detail page for product ID: {ProductId} loaded in {ElapsedMilliseconds} ms", id, stopwatch.ElapsedMilliseconds);

            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword, [FromQuery] int pageNumber = 1, [FromQuery] int itemsPerPage = 21)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Keyword parameter is required.");
            }
            // Validate keyword input
            if (keyword.Length > 100)
            {
                return BadRequest("Keyword parameter is too long.");
            }
            // Remove special characters from keyword
            keyword = Regex.Replace(keyword, @"[^\w\s]", "");

            var stopwatch = Stopwatch.StartNew();

            _logger.LogInformation("Search query received: {Keyword}", keyword);

            var query = _context.Products
                .Where(p => p.Name.Contains(keyword) ||
                            p.Description.Contains(keyword) ||
                            p.Sector.Contains(keyword))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.Stock,
                    p.Sector,
                    Availability = p.Stock > 0 ? "In Stock" : "Out of Stock",
                    Relevance = (p.Name.Contains(keyword) ? 3 : 0) +
                                (p.Description.Contains(keyword) ? 2 : 0) +
                                (p.Sector.Contains(keyword) ? 1 : 0)
                });

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)itemsPerPage);

            var products = await query
                .OrderByDescending(p => p.Relevance)
                .Skip((pageNumber - 1) * itemsPerPage)
                .Take(itemsPerPage)
                .ToListAsync();

            stopwatch.Stop();
            _logger.LogInformation("Search query for keyword: {Keyword} completed in {ElapsedMilliseconds} ms", keyword, stopwatch.ElapsedMilliseconds);

            if (products == null || products.Count == 0)
            {
                return NotFound("No products found matching the keyword.");
            }

            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                ItemsPerPage = itemsPerPage,
                Products = products.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.Stock,
                    p.Sector,
                    p.Availability
                })
            };
            return Ok(response);
        }

        // GET /api/products/{id}/reviews
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetProductReviews(int id, [FromQuery] int pageNumber = 1, [FromQuery] int reviewsPerPage = 10)
        {
            if (pageNumber <= 0 || reviewsPerPage <= 0)
            {
                return BadRequest("Page number and reviews per page must be greater than zero.");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var reviews = await _context.Reviews
                .Where(r => r.ProductId == id)
                .OrderBy(r => r.CreatedAt)
                .Skip((pageNumber - 1) * reviewsPerPage)
                .Take(reviewsPerPage)
                .ToListAsync();

            var totalReviews = await _context.Reviews.CountAsync(r => r.ProductId == id);
            var totalPages = (int)Math.Ceiling(totalReviews / (double)reviewsPerPage);

            var averageRating = reviews.Count > 0 ? reviews.Average(r => (double?)r.Rating) : 0.0;

            var response = new
            {
                Reviews = reviews,
                Pagination = new
                {
                    CurrentPage = pageNumber,
                    ReviewsPerPage = reviewsPerPage,
                    TotalReviews = totalReviews,
                    TotalPages = totalPages
                },
                AverageRaing = averageRating
            };

            return Ok(response);
        }

        // POST /api/products/{id}/reviews
        [HttpPost("{productId}/reviews")]
        [Authorize] // Ensure the user is authenticated
        public async Task<IActionResult> PostReview(int productId, [FromBody] ReviewDTO reviewDto)
        {
            if (reviewDto == null || string.IsNullOrEmpty(reviewDto.ReviewText) || reviewDto.Rating <= 0)
            {
                return BadRequest("Invalid review data.");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var review = new Reviews
            {
                UserId = int.Parse(userId),
                ProductId = productId,
                ReviewText = reviewDto.ReviewText,
                Rating = reviewDto.Rating,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review posted successfully." });
        }

        // DELETE /api/products/{productId}/reviews/{reviewId}
        [HttpDelete("{productId}/reviews/{reviewId}")]
        [Authorize] // Ensure the user is authenticated
        public async Task<IActionResult> DeleteReview(int productId, int reviewId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.ProductId == productId);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserId != int.Parse(userId))
            {
                return Forbid("You are not authorized to delete this review.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully." });
        }
        // PUT /api/products/{productId}/reviews/{reviewId}
        [HttpPut("{productId}/reviews/{reviewId}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int productId, int reviewId, [FromBody] ReviewDTO reviewDto)
        {
            if (reviewDto == null || string.IsNullOrEmpty(reviewDto.ReviewText) || reviewDto.Rating <= 0)
            {
                return BadRequest("Invalid review data.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.ProductId == productId);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserId != int.Parse(userId))
            {
                return Forbid("You are not authorized to update this review.");
            }

            review.ReviewText = reviewDto.ReviewText;
            review.Rating = reviewDto.Rating;
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review updated successfully." });
        }

        // GET /api/products/{productId}/comments
        [HttpGet("{productId}/comments")]
        public async Task<IActionResult> GetProductComments(int productId, [FromQuery] int pageNumber = 1, [FromQuery] int commentsPerPage = 10)
        {
            if (pageNumber <= 0 || commentsPerPage <= 0)
            {
                return BadRequest("Page number and comments per page must be greater than zero.");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var comments = await _context.Comments
                .Where(c => c.ProductId == productId)
                .OrderBy(c => c.Created_At)
                .Skip((pageNumber - 1) * commentsPerPage)
                .Take(commentsPerPage)
                .ToListAsync();

            var totalComments = await _context.Comments.CountAsync(c => c.ProductId == productId);
            var totalPages = (int)Math.Ceiling(totalComments / (double)commentsPerPage);

            var response = new
            {
                Comments = comments,
                Pagination = new
                {
                    CurrentPage = pageNumber,
                    CommentsPerPage = commentsPerPage,
                    TotalComments = totalComments,
                    TotalPages = totalPages
                }
            };

            return Ok(response);
        }

        // POST /api/products/{productId}/comments
        [HttpPost("{productId}/comments")]
        [Authorize]
        public async Task<IActionResult> PostComment(int productId, [FromBody] CommentDTO commentDto)
        {
            if (commentDto == null || string.IsNullOrEmpty(commentDto.Text))
            {
                return BadRequest("Invalid comment data.");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var comment = new Comments
            {
                ProductId = productId,
                Text = commentDto.Text,
                Created_At = DateTime.UtcNow,
                UserId = int.Parse(userId),
                User = user,
                Product = product
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment posted successfully." });
        }

        // DELETE /api/products/{productId}/comments/{commentId}
        [HttpDelete("{productId}/comments/{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int productId, int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.ProductId == productId);
            if (comment == null)
            {
                return NotFound("Comment not found.");
            }

            if (comment.UserId != int.Parse(userId))
            {
                return Forbid("You are not authorized to delete this comment.");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully." });
        }

        // PUT /api/products/{productId}/comments/{commentId}
        [HttpPut("{productId}/comments/{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(int productId, int commentId, [FromBody] CommentDTO commentDto)
        {
            if (commentDto == null || string.IsNullOrEmpty(commentDto.Text))
            {
                return BadRequest("Invalid comment data.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.ProductId == productId);
            if (comment == null)
            {
                return NotFound("Comment not found.");
            }

            if (comment.UserId != int.Parse(userId))
            {
                return Forbid("You are not authorized to update this comment.");
            }

            comment.Text = commentDto.Text;
            comment.Created_At = DateTime.UtcNow;

            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment updated successfully." });
        }
    }
}