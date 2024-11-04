using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using api.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace api.Controllers
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
            [FromQuery] string sector,
            [FromQuery] string sortOrder = "asc",
            [FromQuery] string sortBy = "name",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int itemsPerPage = 10)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(sector))
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
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword, [FromQuery] int pageNumber = 1, [FromQuery] int itemsPerPage = 20)
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
            var totalPages = (int) Math.Ceiling(totalItems / (double) itemsPerPage);

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
    }
}