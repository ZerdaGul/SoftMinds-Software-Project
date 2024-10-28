using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.Models;
using api.DTO;
using api.Data;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDBContext _context;

        public AccountController(AppDBContext context)
        {
            _context = context;
        }

        // POST /api/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Model null veya gerekli alanlar boş ise hata döndür
            if (model == null || string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email) || 
                string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.Phone) || 
                string.IsNullOrEmpty(model.Country))
            {
                return BadRequest("Tüm alanlar gereklidir.");
            }

            // Email doğrulaması
            var emailValidator = new EmailAddressAttribute();
            if (!emailValidator.IsValid(model.Email))
            {
                return BadRequest("Geçersiz email adresi.");
            }

            // Şifre doğrulaması: en az bir büyük harf, bir küçük harf ve bir sayı içermeli
            var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"; // En az 8 karakter
            if (!Regex.IsMatch(model.Password, passwordPattern))
            {
                return BadRequest("Şifre enaz 8 karakterden oluşmalı, en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
            }

            // Telefon numarası doğrulaması: Sadece rakamlar ve 10-11 karakter uzunluğunda olmalı
            var phonePattern = @"^\d{11,12}$";
            if (!Regex.IsMatch(model.Phone, phonePattern))
            {
                return BadRequest("Geçersiz telefon numarası. Numara sadece rakamlardan oluşmalı ve 10-11 haneli olmalıdır.");
            }

            // Aynı email ile kayıtlı kullanıcı olup olmadığını kontrol et
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.");
            }

            // Kullanıcıyı veritabanına ekle
            var user = new Users 
            { 
                Name = model.Name, 
                Email = model.Email, 
                Password = model.Password, 
                Country = model.Country,
                Phone = model.Phone,
                Created_At = DateTime.UtcNow // Oluşturulma tarihini ayarlayın
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Eğer başka bir veritabanı hatası oluşursa genel bir hata mesajı döndürebiliriz.
                return StatusCode(500, "Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            }
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }

        // DELETE /api/account/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Hesap başarıyla silindi." });
        }
    }
}