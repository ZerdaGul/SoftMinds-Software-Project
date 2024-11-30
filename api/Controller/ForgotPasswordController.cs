using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Services;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using api.DTO;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace api.Controllers
{
    [Route("api/forgotpassword")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly EmailService _emailService;
        private readonly PasswordService _passwordService;

        public ForgotPasswordController(AppDBContext context, EmailService emailService, PasswordService passwordService)
        {
            _context = context;
            _emailService = emailService;
            _passwordService = passwordService;
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
            await _emailService.SendForgotPasswordEmail(user.Email, token);

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
            var (hashedPassword, salt) = _passwordService.HashPassword(model.NewPassword);
            user.Password_Hash = hashedPassword;
            user.Password_Salt = salt;
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