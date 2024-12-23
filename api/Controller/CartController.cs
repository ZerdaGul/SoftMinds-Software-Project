using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using api.Models;
using api.Data;
using api.DTO;
using api.Services;

namespace api.Controller
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CartController> _logger;
        private readonly UserService _userService;

        public CartController(AppDBContext context, IConfiguration configuration, ILogger<CartController> logger, UserService userService)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _userService = userService;
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
            var userId = _userService.GetCurrentUserId();
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

        // DELETE: api/cart/remove-item
        [HttpDelete("remove-item")]
        public IActionResult RemoveItemFromCart([FromQuery] int productId)
        {
            var userId = _userService.GetCurrentUserId();
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

            var orderItem = order.OrderItems.FirstOrDefault(oi => oi.ProductId == productId);
            if (orderItem == null)
            {
                _logger.LogWarning($"Order item with product ID {productId} not found in the user's cart.");
                return NotFound($"Order item with product ID {productId} not found in the user's cart.");
            }

            _context.OrderItems.Remove(orderItem);
            _context.SaveChanges();

            UpdateOrderTotalPrice(order.Id);

            _logger.LogInformation($"Removed product ID {productId} from cart for user ID {userId}.");

            return NoContent();
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public IActionResult ClearCart()
        {
            var userId = _userService.GetCurrentUserId();
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
            var userId = _userService.GetCurrentUserId();
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
                return Ok(new List<object>()); // Return an empty list
            }

            var orderItemsWithProductNames = order.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                oi.Quantity,
                oi.Total_Price,
                ProductName = oi.Product?.Name
            }).ToList();

            return Ok(orderItemsWithProductNames);
        }

        // GET: api/cart/summary
        [HttpGet("summary")]
        public IActionResult GetCartSummary()
        {
            var userId = _userService.GetCurrentUserId();
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

        // PATCH: api/cart/update-quantity
        [HttpPatch("update-quantity")]
        public IActionResult UpdateCartItemQuantity([FromBody] CartDTO updateQuantityDto)
        {
            var userId = _userService.GetCurrentUserId();
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

            var orderItem = order.OrderItems.FirstOrDefault(oi => oi.ProductId == updateQuantityDto.ProductId);
            if (orderItem == null)
            {
                _logger.LogWarning($"Order item with product ID {updateQuantityDto.ProductId} not found in the user's cart.");
                return NotFound($"Order item with product ID {updateQuantityDto.ProductId} not found in the user's cart.");
            }

            var product = _context.Products.Find(orderItem.ProductId);
            if (product == null)
            {
                _logger.LogWarning($"Product with ID {orderItem.ProductId} not found.");
                return NotFound($"Product with ID {orderItem.ProductId} not found.");
            }

            if (updateQuantityDto.Quantity > product.Stock)
            {
                _logger.LogWarning("Insufficient stock for the requested quantity.");
                return BadRequest("Insufficient stock for the requested quantity.");
            }

            var previousQuantity = orderItem.Quantity;
            orderItem.Quantity = updateQuantityDto.Quantity;
            orderItem.Total_Price = CalculateTotalPrice(orderItem.ProductId, updateQuantityDto.Quantity);

            _context.OrderItems.Update(orderItem);
            _context.SaveChanges();

            UpdateOrderTotalPrice(orderItem.OrderId);

            _logger.LogInformation($"Updated quantity of product ID {orderItem.ProductId} in cart for user ID {userId}. Previous quantity: {previousQuantity}, New quantity: {updateQuantityDto.Quantity}, Timestamp: {DateTime.UtcNow}");

            return NoContent();
        }

        // POST: api/cart/checkout
        [HttpPost("checkout")]
        public IActionResult Checkout()
        {
            var userId = _userService.GetCurrentUserId();
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