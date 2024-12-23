using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class UserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly AppDBContext _context;

        public UserService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, AppDBContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _context = context;
        }

        public int? GetCurrentUserId()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var idClaim = jsonToken?.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(idClaim))
            {
                return null;
            }

            return int.TryParse(idClaim, out var userId) ? userId : (int?)null;
        }

        public string? GetRole()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return null;
                }

                var user = _context.Users.Find(userId);
                return user?.Role;
            }
            catch
            {
                return null;
            }
        }
    }
}