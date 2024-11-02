using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.Models;
using api.DTO;
using api.Data;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDBContext _context;

        public AccountController(AppDBContext context)
        {
            _context = context;
        }

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

            // İsim kontrolü: Sadece harf ve boşluk karakteri
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.Name, @"^[a-zA-Z\s]+$"))
            {
                return BadRequest("İsim yalnızca harflerden ve boşluk karakterlerinden oluşmalıdır.");
            }

            // Email doğrulaması
            var emailValidator = new EmailAddressAttribute();
            if (!emailValidator.IsValid(model.Email))
            {
                return BadRequest("Geçersiz email adresi.");
            }

            // Şifre doğrulaması
            var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"; 
            if (!Regex.IsMatch(model.Password, passwordPattern))
            {
                return BadRequest("Şifre en az 8 karakterden oluşmalı, en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
            }

            // Telefon numarası doğrulaması
            var phonePattern = @"^\d{11,12}$";
            if (!Regex.IsMatch(model.Phone, phonePattern))
            {
                return BadRequest("Geçersiz telefon numarası. Numara sadece rakamlardan oluşmalı ve 11-12 haneli olmalıdır.");
            }

            // Aynı email ile kayıtlı kullanıcı olup olmadığını kontrol et
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.");
            }

            // Tuz oluştur
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8); // 128 bit tuz

            // Şifreyi hash'le
            string hashed_Password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));


            // Kullanıcıyı veritabanına ekle
            var user = new Users 
            { 
                Name = model.Name, 
                Email = model.Email, 
                Phone = model.Phone,
                Country = model.Country,
                Password_Hash = hashed_Password,
                Password_Salt = Convert.ToBase64String(salt),
                Created_At = DateTime.UtcNow // Oluşturulma tarihini ayarlayın
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return StatusCode(500, "Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            }
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }

        [HttpDelete("account/delete/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            // Aktif oturum cookie'sini sil
            Response.Cookies.Delete("AuthToken");
            return Ok(new { message = "Hesap başarıyla silindi." });
        }
    }
}
