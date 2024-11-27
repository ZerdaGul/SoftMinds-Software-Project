using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.DTO;
using api.Data;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using api.Models;

namespace api.Controller
{
    [Route("api/forgotpassword")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IOptions<EmailSettings> _emailSettings;

        public ForgotPasswordController(AppDBContext context, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _emailSettings = emailSettings;
        }

        // POST /api/forgotpassword/request
        [HttpPost("request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] ForgotPasswordRequestDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest("E-posta alanı gereklidir.");
            }

            // Email validation
            var emailValidator = new EmailAddressAttribute();
            if (!emailValidator.IsValid(model.Email))
            {
                return BadRequest("Geçersiz email adresi.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            // Generate reset token
            var token = GenerateResetToken();
            user.ResetToken = token;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // Send email
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.Value.SenderEmail),
                Subject = "Şifre Sıfırlama Talebi",
                Body = $"Şifrenizi sıfırlamak için lütfen aşağıdaki kodu kullanın:\n{token}",
                IsBodyHtml = false,
            };
            mailMessage.To.Add(model.Email);

            using (var smtpClient = new SmtpClient(_emailSettings.Value.SmtpServer, _emailSettings.Value.SmtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(_emailSettings.Value.SmtpUsername, _emailSettings.Value.SmtpPassword);
                smtpClient.EnableSsl = true;
                await smtpClient.SendMailAsync(mailMessage);
            }

            return Ok("Şifre sıfırlama kodu e-posta adresinize gönderildi.");
        }

        // POST /api/forgotpassword/reset
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