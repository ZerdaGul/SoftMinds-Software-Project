using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.DTO;
using api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Collections.Generic;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;
        private const int MaxFailedAccessAttempts = 5; // Maksimum başarısız giriş denemesi
        private const int LockoutDuration = 5; // Kilitlenme süresi (dakika)

        public AuthController(AppDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Email ve şifre gereklidir.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return Unauthorized("Geçersiz email");
            }

            // Hesap kilitli mi kontrol et
            if (user.Lockout_End.HasValue && user.Lockout_End.Value > DateTime.UtcNow)
            {
                return Unauthorized($"Hesabınız {user.Lockout_End.Value.Subtract(DateTime.UtcNow).Minutes} dakika boyunca kilitli.");
            }

            // Kullanıcının tuzunu kullanarak şifreyi hash'le
            string hashed_Password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.Password,
                salt: Convert.FromBase64String(user.Password_Salt),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            // Hash'lenmiş şifre ile karşılaştır
            if (hashed_Password != user.Password_Hash)
            {
                user.Failed_Login_Attempts++;
                if (user.Failed_Login_Attempts >= MaxFailedAccessAttempts)
                {
                    user.Lockout_End = DateTime.UtcNow.AddMinutes(LockoutDuration);
                    user.Failed_Login_Attempts = 0; // Başarısız giriş denemelerini sıfırla
                }
                await _context.SaveChangesAsync();
                return Unauthorized("Geçersiz şifre.");
            }

            // Başarılı giriş, başarısız giriş denemelerini sıfırla
            user.Failed_Login_Attempts = 0;
            user.Lockout_End = null;
            await _context.SaveChangesAsync();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),  // Token süresi 30 dakika
                signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), message = "Giriş başarılı." });
        }

        // POST /api/auth/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // JWT ile logout işlemi istemci tarafında yapılır. Sunucu tarafında bir işlem yapılmaz.
            return Ok(new { message = "Çıkış başarılı." });
        }
    }
}