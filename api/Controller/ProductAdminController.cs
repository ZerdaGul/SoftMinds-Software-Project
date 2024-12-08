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
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.ProductName, @"^[a-zA-Z\s]+$"))
            {
                return BadRequest("Ürün adı yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            }

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
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.Sector, @"^[a-zA-Z\s]+$"))
            {
                return BadRequest("Sektör yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            }

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
                Sector = model.Sector
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
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.ProductName, @"^[a-zA-Z\s]+$"))
            {
                return BadRequest("Ürün adı yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            }

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
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.Sector, @"^[a-zA-Z\s]+$"))
            {
                return BadRequest("Sektör yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            }

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

            await _context.SaveChangesAsync();

            return Ok("Ürün başarıyla güncellendi.");
        }

        [HttpPost("delete-product")]
        public async Task<IActionResult> DeleteProduct([FromBody] ProductAdminDTO model)
        {
           

            // Ürünü veritabanında bul
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == model.Id);
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

            if(product.Stock <= 0)
            {
                return BadRequest("Ürün stokta yok.");
            }

            return Ok(product);
        }

       /*
            [HttpPost("add-image")]
            public async Task<IActionResult> AddImage([FromForm] ImageModel model)
            {
                // Validate model
                if (model == null || model.Id == Guid.Empty || model.Image == null)
                {
                    return BadRequest("All fields are required.");
                }

                // Validate file extension
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(model.Image.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid image format. Allowed formats are .jpg, .jpeg, .png, .gif.");
                }

                // Validate content type
                var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                if (!allowedContentTypes.Contains(model.Image.ContentType))
                {
                    return BadRequest("Invalid image content type.");
                }

                // Find product in the database
                var product = await _context.Products.FindAsync(model.Id);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                // Ensure the images directory exists
                var imagesDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(imagesDir))
                {
                    Directory.CreateDirectory(imagesDir);
                }

                // Generate a unique filename to prevent overwriting and security issues
                 fileExtension = Path.GetExtension(model.Image.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

                // Combine the images directory and unique filename to create the full path
                var filePath = Path.Combine(imagesDir, uniqueFileName);

                // Save the image to disk
                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(stream);
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception (ex)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error saving the image.");
                }

                // Save the image filename to the database
                product.Image = uniqueFileName;
                await _context.SaveChangesAsync();

                return Ok("Image added successfully.");
            }

            [HttpPost("delete-image")]
            public async Task<IActionResult> DeleteImage([FromBody] DeleteImageModel model)
            {
                // Validate model
                if (model == null || model.Id == Guid.Empty)
                {
                    return BadRequest("Product ID is required.");
                }

                // Find the product in the database
                var product = await _context.Products.FindAsync(model.Id);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                if (string.IsNullOrEmpty(product.Image))
                {
                    return BadRequest("Product does not have an image to delete.");
                }

                // Get the image file path
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", product.Image);

                // Delete the image from disk
                try
                {
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception (ex)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting the image.");
                }

                // Remove the image filename from the database
                product.Image = null;
                await _context.SaveChangesAsync();

                return Ok("Image deleted successfully.");
            }

            [HttpGet("get-image")]
            public async Task<IActionResult> GetImage([FromQuery] Guid id)
            {
                // Validate the id
                if (id == Guid.Empty)
                {
                    return BadRequest("Product ID is required.");
                }

                // Find the product in the database
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                if (string.IsNullOrEmpty(product.Image))
                {
                    return NotFound("Image not found.");
                }

                // Get the image file path
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", product.Image);

                // Check if the file exists
                if (!System.IO.File.Exists(imagePath))
                {
                    return NotFound("Image file not found on the server.");
                }

                // Get the content type
                var contentType = GetContentType(imagePath);

                // Return the image file
                try
                {
                    var memory = new MemoryStream();
                    using (var stream = new FileStream(imagePath, FileMode.Open))
                    {
                        await stream.CopyToAsync(memory);
                    }
                    memory.Position = 0;
                    return File(memory, contentType, Path.GetFileName(imagePath));
                }
                catch (Exception ex)
                {
                    // Log the exception (ex)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving the image.");
                }
            }

            // Helper method to get the content type based on file extension
            private string GetContentType(string path)
            {
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(path, out string contentType))
                {
                    contentType = "application/octet-stream";
                }
                return contentType;
            }
        

        */

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

// Model classes
        public class ImageModel
        {
            public Guid Id { get; set; }
            public IFormFile Image { get; set; }
        }

        public class DeleteImageModel
        {
            public Guid Id { get; set; }
        }

}
}