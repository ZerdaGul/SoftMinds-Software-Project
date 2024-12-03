using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DTO;
using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Services;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly EmailService _emailService;
        private readonly PasswordService _passwordService;

        public AccountController(AppDBContext context, EmailService emailService, PasswordService passwordService)
        {
            _context = context;
            _emailService = emailService;
            _passwordService = passwordService;
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

            var (hashedPassword, salt) = _passwordService.HashPassword(model.Password);

            var user = new Users
            {
                Name = model.Name,
                Email = model.Email,
                Phone = model.Phone,
                Country = model.Country,
                Password_Hash = hashedPassword,
                Password_Salt = salt,
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
            var verificationLink = $"https://api.ekoinv.com/api/auth/verify?email={user.Email}&token={Uri.EscapeDataString(user.Password_Hash)}";
            await _emailService.SendVerificationEmail(user.Email, verificationLink);
        }

    }
}
