using api.Data;
using api.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
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

            if (model == null || model.OrderId == 0)
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

            if (model == null || model.OrderId == 0)
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
    }
}