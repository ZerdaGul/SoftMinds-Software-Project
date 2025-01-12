using api.Data;
using api.Models;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;
using System.Globalization;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    public class ProductAdminController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ProductAdminController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct([FromBody] ProductAdminDTO model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || string.IsNullOrEmpty(model.ProductName) || string.IsNullOrEmpty(model.Description) ||
                model.Price == 0 || model.Stock == 0 || string.IsNullOrEmpty(model.Sector))
            {
                return BadRequest("Tüm alanlar gereklidir.");
            }

            // Ürün adı kontrolü: Sadece harf ve boşluk karakteri
            // if (!System.Text.RegularExpressions.Regex.IsMatch(model.ProductName, @"^[a-zA-Z\s]+$"))
            // {
            //     return BadRequest("Ürün adı yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            // }

            // Ürün fiyatı kontrolü
            if (model.Price <= 0)
            {
                return BadRequest("Geçersiz fiyat.");
            }

            // Ürün stok kontrolü
            if (model.Stock <= 0)
            {
                return BadRequest("Geçersiz stok.");
            }

            // Ürün sektörü kontrolü
            // if (!System.Text.RegularExpressions.Regex.IsMatch(model.Sector, @"^[a-zA-Z\s]+$"))
            // {
            //     return BadRequest("Sektör yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            // }

            // Ürün adı benzersiz mi kontrol et
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Name == model.ProductName);
            if (existingProduct != null)
            {
                return BadRequest("Bu isimde bir ürün zaten var.");
            }

            // Ürünü veritabanına ekle
            var product = new Products
            {
                Name = model.ProductName,
                Description = model.Description,
                Price = model.Price,
                Stock = model.Stock,
                Sector = model.Sector,
                Photo = model.Photo,
                ContentType = model.ContentType
            };



            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return Ok("Ürün başarıyla eklendi.");
        }

        [HttpPost("update-product")]
        public async Task<IActionResult> UpdateProduct([FromBody] ProductAdminDTO model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || string.IsNullOrEmpty(model.ProductName) || string.IsNullOrEmpty(model.Description) ||
                model.Price == 0 || model.Stock == 0 || string.IsNullOrEmpty(model.Sector))
            {
                return BadRequest("Tüm alanlar gereklidir.");
            }

            // Ürün adı kontrolü: Sadece harf ve boşluk karakteri
            // if (!System.Text.RegularExpressions.Regex.IsMatch(model.ProductName, @"^[a-zA-Z\s]+$"))
            // {
            //     return BadRequest("Ürün adı yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            // }

            // Ürün fiyatı kontrolü
            if (model.Price <= 0)
            {
                return BadRequest("Geçersiz fiyat.");
            }

            // Ürün stok kontrolü
            if (model.Stock <= 0)
            {
                return BadRequest("Geçersiz stok.");
            }

            // Ürün sektörü kontrolü
            // if (!System.Text.RegularExpressions.Regex.IsMatch(model.Sector, @"^[a-zA-Z\s]+$"))
            // {
            //     return BadRequest("Sektör yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            // }

            // Ürünü veritabanında bul
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == model.ProductName);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            // Ürünü güncelle
            product.Description = model.Description;
            product.Price = model.Price;
            product.Stock = model.Stock;
            product.Sector = model.Sector;

            // Fotoğraf güncelleme (isteğe bağlı)
            if (model.Photo != null && model.Photo.Length > 0)
            {
                var validContentTypes = new[] { "image/jpeg", "image/png" };
                if (string.IsNullOrEmpty(model.ContentType) || !validContentTypes.Contains(model.ContentType.ToLower()))
                {
                    return BadRequest("Geçersiz fotoğraf türü. Sadece JPG veya PNG kabul edilir.");
                }

                product.Photo = model.Photo;
                product.ContentType = model.ContentType;
            }
            // Eğer yeni fotoğraf gelmediyse önceki fotoğrafı koruyoruz. Burada ek bir işlem yapmaya gerek yok.

            await _context.SaveChangesAsync();

            return Ok("Ürün başarıyla güncellendi.");
        }

        [HttpDelete("delete-product/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            // Ürünü veritabanında bul
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            // Ürünü veritabanından sil
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok("Ürün başarıyla silindi.");
        }

        [HttpGet("get-products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.Where(p => p.Stock > 0).ToListAsync();
            return Ok(products);
        }

        [HttpGet("get-product")]
        public async Task<IActionResult> GetProduct([FromQuery] int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            if (product.Stock <= 0)
            {
                return BadRequest("Ürün stokta yok.");
            }

            return Ok(product);
        }


        [HttpPost("add-image")]
        public async Task<IActionResult> AddImage([FromBody] ProductAdminDTO model)
        {
            // Validate model
            if (model == null || model.Id <= 0 || model.Photo == null || model.Photo.Length == 0)
            {
                return BadRequest("Product ID and image are required.");
            }

            // Validate ContentType
            if (string.IsNullOrEmpty(model.ContentType))
            {
                return BadRequest("Content type is required.");
            }

            var validContentTypes = new[] { "image/jpeg", "image/png" };
            if (!validContentTypes.Contains(model.ContentType.ToLower()))
            {
                return BadRequest("Invalid file type. Only JPG and PNG files are allowed.");
            }

            // Find the product in the database
            var product = await _context.Products.FindAsync(model.Id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Assign the photo and content type
            product.Photo = model.Photo;
            product.ContentType = model.ContentType;

            await _context.SaveChangesAsync();

            return Ok("Image added successfully.");
        }

        [HttpPost("delete-image")]
        public async Task<IActionResult> DeleteImage([FromBody] ProductAdminDTO model)
        {
            // Validate model
            if (model == null || model.Id <= 0)
            {
                return BadRequest("Product ID is required.");
            }

            // Find the product in the database
            var product = await _context.Products.FindAsync(model.Id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (product.Photo == null || product.Photo.Length == 0)
            {
                return BadRequest("Product does not have an image to delete.");
            }

            // Remove the image from the database
            product.Photo = null;
            product.ContentType = null;
            await _context.SaveChangesAsync();

            return Ok("Image deleted successfully.");
        }

        [HttpGet("get-image")]
        public async Task<IActionResult> GetImage([FromQuery] int id)
        {
            // Validate the id
            if (id <= 0)
            {
                return BadRequest("Product ID is required.");
            }

            // Find the product in the database
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Check if product has a photo
            if (product.Photo == null || product.Photo.Length == 0)
            {
                return NotFound("No image found for this product.");
            }

            // Return the image file from the database
            try
            {
                return File(product.Photo, product.ContentType ?? "application/octet-stream");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving the image.");
            }
        }




        [HttpPost("update-stock")]
        public async Task<IActionResult> UpdateStock([FromBody] ProductAdminDTO model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || string.IsNullOrEmpty(model.ProductName) || model.Stock == 0)
            {
                return BadRequest("Ürün adı ve stok gereklidir.");
            }

            // Ürün stok kontrolü
            if (model.Stock <= 0)
            {
                return BadRequest("Geçersiz stok.");
            }

            // Ürünü veritabanında bul
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == model.ProductName);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            // Stok miktarını güncelle
            product.Stock = model.Stock;
            await _context.SaveChangesAsync();

            return Ok("Stok başarıyla güncellendi.");
        }

        [HttpGet("get-low-stock-products")]
        public async Task<IActionResult> GetLowStockProducts()
        {
            var products = await _context.Products.Where(p => p.Stock < 10).ToListAsync();
            return Ok(products);
        }

        [HttpPost("update-price")]
        public async Task<IActionResult> UpdatePrice([FromBody] ProductAdminDTO model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || string.IsNullOrEmpty(model.ProductName) || model.Price == 0)
            {
                return BadRequest("Ürün adı ve fiyat gereklidir.");
            }

            // Ürün fiyatı kontrolü
            if (model.Price <= 0)
            {
                return BadRequest("Geçersiz fiyat.");
            }

            // Ürünü veritabanında bul
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == model.ProductName);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            // Fiyatı güncelle
            product.Price = model.Price;
            await _context.SaveChangesAsync();

            return Ok("Fiyat başarıyla güncellendi.");
        }


        [HttpGet("get-income")]
        public async Task<IActionResult> GetIncome([FromQuery] string startDate, [FromQuery] string endDate)
        {
            // Define the expected date format
            var dateFormat = "dd.MM.yyyy";
            DateTime startDateTime;
            DateTime endDateTime;

            // Try to parse the startDate
            if (!DateTime.TryParseExact(startDate, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out startDateTime))
            {
                return BadRequest("Invalid startDate format. Expected format is dd.MM.yyyy.");
            }

            // Try to parse the endDate
            if (!DateTime.TryParseExact(endDate, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out endDateTime))
            {
                return BadRequest("Invalid endDate format. Expected format is dd.MM.yyyy.");
            }

            var income = await _context.Orders
                .Where(o => o.Order_Date >= startDateTime && o.Order_Date <= endDateTime)
                .SumAsync(o => o.Total_Price);

            return Ok(income);
        }

        [HttpGet("get-income-by-product")]
        public async Task<IActionResult> GetIncomeByProduct([FromQuery] int Order_Id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var income = await _context.Orders
                .Where(o => o.Id == Order_Id && o.Order_Date >= startDate && o.Order_Date <= endDate)
                .SumAsync(o => o.Total_Price);


            return Ok(income);
        }

        [HttpGet("get-income-by-month")]
        public async Task<IActionResult> GetIncomeByMonth([FromQuery] int month, [FromQuery] int year)
        {
            var income = await _context.Orders
                .Where(o => o.Order_Date.Month == month && o.Order_Date.Year == year)
                .SumAsync(o => o.Total_Price);

            return Ok(income);
        }



    }
}