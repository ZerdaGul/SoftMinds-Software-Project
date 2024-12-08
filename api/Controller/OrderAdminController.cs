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
                .Where(o => o.Id == model.OrderId && o.State == "Requested")
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'Requested' değil.");
            }

            order.State = "Accepted";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla kabul edildi.");
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
                .Where(o => o.Id == model.OrderId && o.State == "Requested")
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
                .Where(o => o.Id == model.OrderId && o.State == "Requested")
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'Requested' değil.");
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
            // Retrieve the user ID using the UserService
            var userIdInt = _userService.GetCurrentUserId();

            if (userIdInt == null)
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            var myOrders = await _context.Orders
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userIdInt)
                .ToListAsync();

            return Ok(myOrders);
        }
    }
}
