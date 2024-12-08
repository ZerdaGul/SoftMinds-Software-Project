using api.Data;
using api.Models;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims; // For accessing claims

namespace api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class OrderAdminController : ControllerBase
    {
        private readonly AppDBContext _context;

        public OrderAdminController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("accept-order")]
        public async Task<IActionResult> AcceptOrder([FromBody] OrderModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.OrderId))
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders.FindAsync(model.OrderId);
            if (order == null)
            {
                return NotFound("Sipariş bulunamadı.");
            }

            order.State = "Accepted";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla kabul edildi.");
        }

        [HttpPost("reject-order")]
        public async Task<IActionResult> RejectOrder([FromBody] OrderModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.OrderId))
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders.FindAsync(model.OrderId);
            if (order == null)
            {
                return NotFound("Sipariş bulunamadı.");
            }

            order.State = "Rejected";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla reddedildi.");
        }

        [HttpPost("complete-order")]
        public async Task<IActionResult> CompleteOrder([FromBody] OrderModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.OrderId))
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders.FindAsync(model.OrderId);
            if (order == null)
            {
                return NotFound("Sipariş bulunamadı.");
            }

            order.State = "Done";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla tamamlandı.");
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("orders-status")]
        public async Task<IActionResult> GetOrdersByStatus()
        {
            var inProgressOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.State == "Accepted")
                .ToListAsync();

            var doneOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.State == "Done")
                .ToListAsync();

            return Ok(new 
            { 
                InProgress = inProgressOrders, 
                Done = doneOrders 
            });
        }

        [HttpGet("order-history/{userId}")]
        public async Task<IActionResult> GetOrderHistory([FromRoute] int userId)
        {
            var userOrders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            var done = userOrders.Where(o => o.State == "Done").ToList();
            var inProgress = userOrders.Where(o => o.State == "Accepted").ToList();
            var rejected = userOrders.Where(o => o.State == "Rejected").ToList();

            return Ok(new 
            {
                Done = done,
                InProgress = inProgress,
                Rejected = rejected
            });
        }

        // New endpoint to get orders for the currently logged-in user
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            // Retrieve the user ID from the active session (via claims)
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            // Convert the string userId to an integer
            if (!int.TryParse(userIdStr, out int userIdInt))
            {
                return BadRequest("Geçersiz kullanıcı kimliği formatı.");
            }

            var myOrders = await _context.Orders
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userIdInt)
                .ToListAsync();

            return Ok(myOrders);
        }
    }
}
