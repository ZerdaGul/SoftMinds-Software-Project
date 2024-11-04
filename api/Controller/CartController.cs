using Microsoft.AspNetCore.Mvc;
using api.Models;

using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using api.Data;
using api.DTO;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CartController> _logger;

        public CartController(AppDBContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<CartController> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/cart
        [HttpPost]
        public IActionResult AddToCart([FromBody] CartDTO cartDto)
        {
            if (cartDto == null)
            {
                _logger.LogWarning("Invalid cart data.");
                return BadRequest("Invalid cart data.");
            }

            // Get the current user from the session
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                _logger.LogWarning("User is not authenticated.");
                return Unauthorized("User is not authenticated.");
            }

            var product = _context.Products.Find(cartDto.ProductId);
            if (product == null)
            {
                _logger.LogWarning($"Product with ID {cartDto.ProductId} not found.");
                return NotFound($"Product with ID {cartDto.ProductId} not found.");
            }

            var orderItem = _context.OrderItems
                .FirstOrDefault(oi => oi.OrderId == GetOrCreateOrderId(userId.Value) && oi.ProductId == cartDto.ProductId);

            if (orderItem != null)
            {
                // Ürün zaten sepette, miktarını güncelle
                if (orderItem.Quantity + cartDto.Quantity > product.Stock)
                {
                    _logger.LogWarning("Insufficient stock for the requested quantity.");
                    return BadRequest("Insufficient stock for the requested quantity.");
                }

                orderItem.Quantity += cartDto.Quantity;
                orderItem.Total_Price = CalculateTotalPrice(orderItem.ProductId, orderItem.Quantity);
                _context.OrderItems.Update(orderItem);
                _logger.LogInformation($"Updated quantity of product ID {cartDto.ProductId} in cart for user ID {userId.Value}.");
            }
            else
            {
                // Ürün sepette değil, yeni ürün ekle
                if (cartDto.Quantity > product.Stock)
                {
                    _logger.LogWarning("Insufficient stock for the requested quantity.");
                    return BadRequest("Insufficient stock for the requested quantity.");
                }

                orderItem = new OrderItem
                {
                    OrderId = GetOrCreateOrderId(userId.Value),
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity,
                    Total_Price = CalculateTotalPrice(cartDto.ProductId, cartDto.Quantity)
                };
                _context.OrderItems.Add(orderItem);
                _logger.LogInformation($"Added product ID {cartDto.ProductId} to cart for user ID {userId.Value}.");
            }

            _context.SaveChanges();

            UpdateOrderTotalPrice(orderItem.OrderId);

            return CreatedAtAction(nameof(GetCartItem), new { id = orderItem.Id }, orderItem);
        }

        // DELETE: api/cart/{id}
        [HttpDelete("{id}")]
        public IActionResult RemoveFromCart(int id)
        {
            var orderItem = _context.OrderItems.Find(id);
            if (orderItem == null)
            {
                _logger.LogWarning($"Order item with ID {id} not found.");
                return NotFound($"Order item with ID {id} not found.");
            }

            var orderId = orderItem.OrderId;

            _context.OrderItems.Remove(orderItem);
            _context.SaveChanges();

            UpdateOrderTotalPrice(orderId);
            var userId = orderItem.Order?.UserId;
            _logger.LogInformation($"Removed product ID {orderItem.ProductId} from cart for user ID {userId}.");

            return NoContent();
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public IActionResult ClearCart()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                _logger.LogWarning("User is not authenticated.");
                return Unauthorized("User is not authenticated.");
            }

            var order = _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.UserId == userId && o.State == "Pending");

            if (order == null)
            {
                _logger.LogWarning("No pending order found for the user.");
                return NotFound("No pending order found for the user.");
            }

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.SaveChanges();

            UpdateOrderTotalPrice(order.Id);

            _logger.LogInformation($"Cleared cart for user ID {userId.Value}.");

            return NoContent();
        }

        // GET: api/cart/{id}
        [HttpGet("{id}")]
        public IActionResult GetCartItem(int id)
        {
            var orderItem = _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .FirstOrDefault(oi => oi.Id == id);

            if (orderItem == null)
            {
                _logger.LogWarning($"Order item with ID {id} not found.");
                return NotFound($"Order item with ID {id} not found.");
            }

            return Ok(orderItem);
        }

        // GET: api/cart
        [HttpGet]
        public IActionResult GetAllCartItems()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                _logger.LogWarning("User is not authenticated.");
                return Unauthorized("User is not authenticated.");
            }

            var order = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefault(o => o.UserId == userId && o.State == "Pending");

            if (order == null)
            {
                _logger.LogWarning("No pending order found for the user.");
                return NotFound("No pending order found for the user.");
            }

            return Ok(order.OrderItems);
        }

        // GET: api/cart/summary
        [HttpGet("summary")]
        public IActionResult GetCartSummary()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                _logger.LogWarning("User is not authenticated.");
                return Unauthorized("User is not authenticated.");
            }

            var order = _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.UserId == userId && o.State == "Pending");

            if (order == null)
            {
                _logger.LogWarning("No pending order found for the user.");
                return NotFound("No pending order found for the user.");
            }

            var summary = new
            {
                TotalPrice = order.Total_Price,
                TotalItems = order.OrderItems.Count
            };

            return Ok(summary);
        }

        // PATCH: api/cart/{id}/quantity
        [HttpPatch("{id}/quantity")]
        public IActionResult UpdateCartItemQuantity(int id, [FromBody] int quantity)
        {
            var orderItem = _context.OrderItems.Find(id);
            if (orderItem == null)
            {
                _logger.LogWarning($"Order item with ID {id} not found.");
                return NotFound($"Order item with ID {id} not found.");
            }

            var product = _context.Products.Find(orderItem.ProductId);
            if (product == null)
            {
                _logger.LogWarning($"Product with ID {orderItem.ProductId} not found.");
                return NotFound($"Product with ID {orderItem.ProductId} not found.");
            }

            if (quantity > product.Stock)
            {
                _logger.LogWarning("Insufficient stock for the requested quantity.");
                return BadRequest("Insufficient stock for the requested quantity.");
            }

            orderItem.Quantity = quantity;
            orderItem.Total_Price = CalculateTotalPrice(orderItem.ProductId, quantity);

            _context.OrderItems.Update(orderItem);
            _context.SaveChanges();

            UpdateOrderTotalPrice(orderItem.OrderId);
            var userId = orderItem.Order?.UserId;
            _logger.LogInformation($"Updated quantity of product ID {orderItem.ProductId} in cart for user ID {userId}.");

            return NoContent();
        }

        // POST: api/cart/checkout
        [HttpPost("checkout")]
        public IActionResult Checkout()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                _logger.LogWarning("User is not authenticated.");
                return Unauthorized("User is not authenticated.");
            }

            var order = _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.UserId == userId && o.State == "Pending");

            if (order == null)
            {
                _logger.LogWarning("No pending order found for the user.");
                return NotFound("No pending order found for the user.");
            }

            // Siparişi tamamla ve durumu güncelle
            order.State = "Requested";
            _context.Orders.Update(order);
            _context.SaveChanges();

            _logger.LogInformation($"User ID {userId.Value} checked out their cart.");

            return Ok(order);
        }

        private int? GetCurrentUserId()
        {
            // Implement logic to get the current user ID from the JWT token
            var token = _httpContextAccessor.HttpContext?.Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                return null;
            }
            var key = Encoding.UTF8.GetBytes(jwtKey);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

                return int.Parse(userId);
            }
            catch
            {
                return null;
            }
        }

        private int GetOrCreateOrderId(int userId)
        {
            // Implement logic to get or create an order ID for the current user
            var order = _context.Orders.FirstOrDefault(o => o.UserId == userId && o.State == "Pending");
            if (order == null)
            {
                order = new Orders
                {
                    UserId = userId,
                    Total_Price = 0,
                    Order_Date = DateTime.Now,
                    State = "Pending"
                };
                _context.Orders.Add(order);
                _context.SaveChanges();
            }
            return order.Id;
        }

        private decimal CalculateTotalPrice(int productId, int quantity)
        {
            // Implement logic to calculate the total price based on product ID and quantity
            var product = _context.Products.Find(productId);
            return product != null ? product.Price * quantity : 0;
        }

        private void UpdateOrderTotalPrice(int orderId)
        {
            var order = _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.Id == orderId);

            if (order != null)
            {
                order.Total_Price = order.OrderItems.Sum(oi => oi.Total_Price);
                _context.Orders.Update(order);
                _context.SaveChanges();
            }
        }
    }
}