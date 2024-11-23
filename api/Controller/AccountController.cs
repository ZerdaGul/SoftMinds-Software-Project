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

using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.Extensions.Options;

namespace api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IOptions<EmailSettings> _emailSettings;

        public AccountController(AppDBContext context, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _emailSettings = emailSettings;
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
                Created_At = DateTime.UtcNow, // Oluşturulma tarihini ayarlayın
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                // Email doğrulama mesajı gönder
                // await SendVerificationEmail(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin. Hata: " + ex.Message);
            }
            // Email doğrulama mesajı gönder
            await SendVerificationEmail(user);
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
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail(string email, string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            // Token doğrulaması (basit bir karşılaştırma, daha güvenli bir yöntem kullanabilirsiniz)
            if (user.Password_Hash != token)
            {
                return BadRequest("Geçersiz doğrulama token'ı.");
            }

            // Kullanıcıyı doğrula
            user.Is_Email_Verified = true;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Doğrulama tamamlandı.");
        }
        private async Task SendVerificationEmail(Users user)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.Value.SenderName, _emailSettings.Value.SenderEmail));
            message.To.Add(new MailboxAddress(user.Name, user.Email));
            message.Subject = "Email Verification";

            var verificationLink = $"http://localhost:5115/api/verify?email={user.Email}&token={user.Password_Hash}";
            message.Body = new TextPart("plain")
            {
                Text = $"Please verify your email by clicking on the following link: {verificationLink}"
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettings.Value.SmtpServer, _emailSettings.Value.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.Value.SmtpUsername, _emailSettings.Value.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}
