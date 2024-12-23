using api.Data;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Services;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    public class OrderAdminController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly UserService _userService;

        public OrderAdminController(AppDBContext context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpPost("accept-order")]
        public async Task<IActionResult> AcceptOrder([FromBody] OrderModel model)
        {
            if (_userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }

            if (model == null || model.OrderId <= 0)
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == model.OrderId && o.State == "Requested")
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'Requested' değil.");
            }

            order.State = "InProgress";
            await _context.SaveChangesAsync();

            return Ok("Sipariş incelemeye alındı.");
        }

        [HttpPost("reject-order")]
        public async Task<IActionResult> RejectOrder([FromBody] OrderModel model)
        {
            if (_userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }

            if (model == null || model.OrderId <= 0)
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders
                .Where(o => o.Id == model.OrderId && (o.State == "Requested" || o.State == "InProgress"))
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'Requested' değil.");
            }

            order.State = "Rejected";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla reddedildi.");
        }

        [HttpPost("complete-order")]
        public async Task<IActionResult> CompleteOrder([FromBody] OrderModel model)
        {
            if (_userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }
        
            if (model == null || model.OrderId <= 0)
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }
        
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == model.OrderId && o.State == "InProgress")
                .FirstOrDefaultAsync();
        
            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'Requested' değil.");
            }
        
            order.State = "Accepted";
        
            foreach (var orderItem in order.OrderItems)
            {
                var product = orderItem.Product;
                if (product == null)
                {
                    return NotFound($"Product with ID {orderItem.ProductId} not found.");
                }
        
                if (product.Stock < orderItem.Quantity)
                {
                    return BadRequest($"Product with ID {product.Id} has insufficient stock.");
                }
        
                product.Stock -= orderItem.Quantity;
                _context.Products.Update(product);
            }
        
            await _context.SaveChangesAsync();
        
            return Ok("Sipariş başarıyla tamamlandı.");
        }

        [HttpGet("requested-orders")]
        public async Task<IActionResult> GetRequestedOrders()
        {
            if (_userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }
            var orders = await _context.Orders
                .Where(o => o.State == "Requested")
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("orders-status")]
        public async Task<IActionResult> GetOrdersByStatus()
        {   
            if (_userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }
            var inProgressOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.State == "InProgress")
                .ToListAsync();

            var doneOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.State == "Accepted" || o.State == "Rejected")
                .ToListAsync();

            return Ok(new
            {
                InProgress = inProgressOrders,
                Done = doneOrders
            });
        }

        [HttpGet("orders-history")]
        public async Task<IActionResult> GetOrderHistory()
        {
            var userId = _userService.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            if (_userService.GetRole() != "customer")
            {
                return Forbid("You are not authorized to perform this action.");
            }
        
            var userOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync();
        
            var requested = userOrders.Where(o => o.State == "Requested").ToList();
            var inProgress = userOrders.Where(o => o.State == "InProgress").ToList();
            var done = userOrders.Where(o => o.State == "Accepted" || o.State == "Rejected").ToList();
        
            return Ok(new
            {
                Requested = requested,
                InProgress = inProgress,
                Done = done
            });
        }
    }
}
