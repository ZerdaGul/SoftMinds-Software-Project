using api.Data;
using api.Models;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;


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
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || model.OrderId == "")
            {
                return BadRequest("Sipariş ID'si gereklidir.");
            }

            var order = await _context.Orders.FindAsync(model.OrderId);
            if (order == null)
            {
                return NotFound("Sipariş bulunamadı.");
            }

            order.State ="Accepted";
            await _context.SaveChangesAsync();

            return Ok("Sipariş başarıyla kabul edildi.");
        }

        [HttpPost("reject-order")]
        public async Task<IActionResult> RejectOrder([FromBody] OrderModel model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || model.OrderId == "")
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

}
}