using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace api.Services
{
    public class PasswordService
    {
        public (string hashedPassword, string salt) HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return (hashedPassword, Convert.ToBase64String(salt));
        }

        public bool VerifyPassword(string password, string hashedPassword, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            string hashedPasswordToVerify = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return hashedPassword == hashedPasswordToVerify;
        }
    }
}