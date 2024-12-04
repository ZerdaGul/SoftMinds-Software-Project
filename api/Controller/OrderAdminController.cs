using api.Data;
using api.Models;
using api.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    [Authorize(Roles = "oadmin")]
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
            if (model == null || model.OrderId == 0)
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders
                .Where(o => o.Id == model.OrderId && o.State == "request")
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'request' değil.");
            }

            order.State = "Accepted";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla kabul edildi.");
        }

        [HttpPost("reject-order")]
        public async Task<IActionResult> RejectOrder([FromBody] OrderModel model)
        {
            if (model == null || model.OrderId == 0)
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders
                .Where(o => o.Id == model.OrderId && o.State == "request")
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Sipariş bulunamadı veya sipariş durumu 'request' değil.");
            }

            order.State = "Rejected";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla reddedildi.");
        }

        [HttpGet("requested-orders")]
        public async Task<IActionResult> GetRequestedOrders()
        {
            var orders = await _context.Orders
                .Where(o => o.State == "request")
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }
    }
}