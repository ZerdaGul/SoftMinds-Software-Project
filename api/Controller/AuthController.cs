using Microsoft.AspNetCore.Mvc;
using api.DTO;
using api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private const int MaxFailedAccessAttempts = 5; // Maksimum başarısız giriş denemesi
        private const int LockoutDuration = 5; // Kilitlenme süresi (dakika)

        public AuthController(AppDBContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
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

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                return StatusCode(500, "JWT key is not configured.");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),  // Token süresi 1 gün
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            _httpContextAccessor.HttpContext?.Session.SetString("AuthToken", tokenString);

            return Ok(new { token = tokenString });
        }

        // POST /api/auth/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _httpContextAccessor.HttpContext?.Session.Clear();
            return Ok(new { message = "Çıkış başarılı." });
        }

        // GET /api/auth/active-session
        [HttpGet("active-session")]
        public async Task<IActionResult> GetActiveSession()
        {
            var token = _httpContextAccessor.HttpContext?.Session.GetString("AuthToken");
            if (string.IsNullOrEmpty(token))
            {
                return NotFound(new { message = "Oturum bulunamadı." });
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var email = jsonToken?.Claims.First(claim => claim.Type == ClaimTypes.Name).Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Name,
                user.Country,
                user.Phone
            });
        }
    }
}