using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ProductsController(AppDBContext context)
        {
            _context = context;
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
    }
}