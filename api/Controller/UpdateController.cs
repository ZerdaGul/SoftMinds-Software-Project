using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.Models;
using api.DTO;
using api.Data;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;


namespace api.Controllers;
[Route("api/update")]
[ApiController]
public class UpdateController : ControllerBase
{
    private readonly AppDBContext _context;
    
    public UpdateController(AppDBContext context)
    {
        _context = context;
    }

    // POST /api/update
    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateModel model)
    {
         string hashedPassword;
        if (model == null || string.IsNullOrEmpty(model.CurrentEmail))
        {
            return BadRequest("E-posta alanı gereklidir.");
        }

        // Email validation
        var emailValidator = new EmailAddressAttribute();
        if (!emailValidator.IsValid(model.CurrentEmail))
        {
            return BadRequest("Geçersiz email adresi.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.CurrentEmail);
        if (existingUser == null)
        {
            return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.");
        }

        if(existingUser.Email != model.CurrentEmail)
        {
            return BadRequest("E-posta adresi doğrulanamadı.");
        }


        // Only update if Password is provided
        if (!string.IsNullOrEmpty(model.CurrentPassword))
        {
            // Validate the current password
                hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.CurrentPassword,
                salt: Convert.FromBase64String(existingUser.Password_Salt),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            if (hashedPassword != existingUser.Password_Hash)
            {
                return BadRequest("Geçersiz mevcut şifre.");
            }
        }
        
        if (!string.IsNullOrEmpty(model.Email))
        {
            
            existingUser.Email = model.Email;
        }

        if (!string.IsNullOrEmpty(model.Phone))
                {
                    // Telefon numarası doğrulaması
                    var phonePattern = @"^\d{11,12}$";
                    if (!Regex.IsMatch(model.Phone, phonePattern))
                    {
                        return BadRequest("Geçersiz telefon numarası.");
                    }
                    existingUser.Phone = model.Phone;
        }

        if (!string.IsNullOrEmpty(model.Name))
        {
            existingUser.Name = model.Name;
        }

        if (!string.IsNullOrEmpty(model.Country))
        {
            existingUser.Country = model.Country;
        }


        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();

        return Ok("Kullanıcı başarıyla güncellendi.");
    }

    // POST /api/update/reset-password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        
        if (model == null || string.IsNullOrEmpty(model.CurrentEmail))
        {
            return BadRequest("E-posta alanı gereklidir.");
        }

        // Email validation
        var emailValidator = new EmailAddressAttribute();
        if (!emailValidator.IsValid(model.CurrentEmail))
        {
            return BadRequest("Geçersiz email adresi.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.CurrentEmail);
        if (existingUser == null)
        {
            return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.");
        }

        if(existingUser.Email != model.CurrentEmail)
        {
            return BadRequest("E-posta adresi doğrulanamadı.");
        }

        // Validate the current password
        var hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: model.CurrentPassword,
            salt: Convert.FromBase64String(existingUser.Password_Salt),
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));

        if (hashedPassword != existingUser.Password_Hash)
        {
            return BadRequest("Geçersiz mevcut şifre.");
        }

        // Validate the new password
        var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$";
        if (!Regex.IsMatch(model.Password, passwordPattern))
        {
            return BadRequest("Şifre en az 8 karakterden oluşmalı, en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
        }

        // Generate a new salt for hashing
        byte[] salt = new byte[128 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Hash the password using the new salt
        hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: model.Password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));

        // Store the hashed password and the salt
        existingUser.Password_Hash = hashedPassword;
        existingUser.Password_Salt = Convert.ToBase64String(salt);

        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();

        return Ok("Şifre başarıyla güncellendi.");

    }
}

