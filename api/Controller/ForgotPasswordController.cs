using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Services;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using api.DTO;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly EmailService _emailService;


        public ForgotPasswordController(AppDBContext context, EmailService emailService, ILogger<ForgotPasswordController> logger)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST api/forgotpassword
        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest("Invalid email data.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Generate reset token
            var token = GenerateResetToken();
            user.ResetToken = token;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour
            await _context.SaveChangesAsync();

            // Send email
            var subject = "Şifre Sıfırlama Talebi";
            var body = $"Şifrenizi sıfırlamak için lütfen aşağıdaki kodu kullanın:\n{token}";
            await _emailService.SendEmailAsync(user.Email, subject, body);

            return Ok(new { message = "Şifre sıfırlama talimatları e-posta ile gönderildi." });
        }

        // POST api/forgotpassword/reset
        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest("Geçersiz istek.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == model.Token && u.ResetTokenExpires > DateTime.UtcNow);
            if (user == null)
            {
                return BadRequest("Geçersiz veya süresi dolmuş token.");
            }

            // Hash new password
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            string hashed_Password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.NewPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            user.Password_Hash = hashed_Password;
            user.Password_Salt = Convert.ToBase64String(salt);
            user.ResetToken = null;
            user.ResetTokenExpires = null;
            await _context.SaveChangesAsync();

            return Ok("Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.");
        }

        private string GenerateResetToken()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}