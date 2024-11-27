using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Controller
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public CategoriesController(AppDBContext context)
        {
            _context = context;
        }

        // GET /api/categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Products
                .GroupBy(p => p.Sector)
                .Select(g => new
                {
                    Name = g.Key,
                    ProductCount = g.Count()
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}