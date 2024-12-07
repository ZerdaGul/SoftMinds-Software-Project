using Microsoft.AspNetCore.Mvc;
using api.DTO;
using api.Data;
using api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace api.Controller
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordService _passwordService;

        private const int MaxFailedAccessAttempts = 5; // Maksimum başarısız giriş denemesi
        private const int LockoutDuration = 5; // Kilitlenme süresi (dakika)

        public AuthController(AppDBContext context, IConfiguration configuration, PasswordService passwordService)
        {
            _context = context;
            _configuration = configuration;
            _passwordService = passwordService;
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

            if (user.Is_Email_Verified == false)
            {
                return Unauthorized("Email adresiniz doğrulanmamış. Lütfen email adresinizi doğrulayın.");
            }

            // Hesap kilitli mi kontrol et
            if (user.Lockout_End.HasValue && user.Lockout_End.Value > DateTime.UtcNow)
            {
                return Unauthorized($"Hesabınız {user.Lockout_End.Value.Subtract(DateTime.UtcNow).Minutes} dakika boyunca kilitli.");
            }

            // Şifreyi doğrula
            if (!_passwordService.VerifyPassword(model.Password, user.Password_Hash, user.Password_Salt))
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

            // Mevcut AuthToken çerezini sil
            Response.Cookies.Delete("AuthToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
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

            Response.Cookies.Append("AuthToken", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddHours(1)
            });

            return Ok(new { Token = tokenString });
        }

        // POST /api/auth/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("AuthToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
            return Ok(new { message = "Çıkış başarılı." });
        }

        // GET /api/auth/active-session
        [HttpGet("active-session")]
        public async Task<IActionResult> ActiveSession()
        {
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return NotFound(new { message = "Oturum bulunamadı." });
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var idClaim = jsonToken?.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(idClaim))
            {
                return NotFound(new { message = "Geçerli bir oturum bulunamadı." });
            }

            if (!int.TryParse(idClaim, out var userId))
            {
                return NotFound(new { message = "Geçerli bir oturum bulunamadı." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
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
                user.Phone,
                user.Role
            });
        }

        // GET /api/auth/verify
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail(string email, string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            // Token doğrulaması
            var decodedToken = Uri.UnescapeDataString(token);
            if (user.Password_Hash != decodedToken)
            {
                return BadRequest("Geçersiz doğrulama token'ı.");
            }

            // Kullanıcıyı doğrula
            user.Is_Email_Verified = true;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Doğrulama tamamlandı.");
        }
    }
}