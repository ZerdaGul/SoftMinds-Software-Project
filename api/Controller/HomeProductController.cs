using api.Data;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller;

[ApiController]
[Route("api/homepage")]
public class HomeProductController : ControllerBase
{
    private readonly AppDBContext _context;

    public HomeProductController(AppDBContext context)
    {
        _context = context;
    }

    // GET /api/homepage/featured-products
    [HttpGet("featured-products")]
    public async Task<ActionResult<IEnumerable<ProductDTO>>> GetFeaturedProducts()
    {
        // Son eklenen 3 ürünü alıyoruz
        var products = await _context.Products
            .OrderByDescending(p => p.Id) // Id'ye göre sıralama
            .Take(3)
            .Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                PhotoUrl = p.Photo != null ? $"data:{p.ContentType};base64,{Convert.ToBase64String(p.Photo)}" : null
            })
            .ToListAsync();

        return Ok(products);
    }
}