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
using api.Services;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly EmailService _emailService;

        public AccountController(AppDBContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8); // 128-bit salt
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            var user = new Users
            {
                Name = model.Name,
                Email = model.Email,
                Phone = model.Phone,
                Country = model.Country,
                Password_Hash = hashedPassword,
                Password_Salt = Convert.ToBase64String(salt),
                Created_At = DateTime.UtcNow,
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                await SendVerificationEmail(user);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering the user. Please try again.");
            }

            return Ok(new { message = "User registered successfully. Please verify your email." });
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

            return Ok(new { message = "Hesap başarıyla silindi." });
        }

        private async Task SendVerificationEmail(Users user)
        {
            var subject = "Email Verification";
            var verificationLink = $"https://api.ekoinv.com/api/verify?email={user.Email}&token={Uri.EscapeDataString(user.Password_Hash)}";
            var body = $"Please verify your email by clicking on the following link: {verificationLink}";

            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

    }
}
