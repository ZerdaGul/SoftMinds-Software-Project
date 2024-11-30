using Microsoft.AspNetCore.Mvc;
using api.DTO;
using api.Data;
using api.Services;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;


namespace api.Controller;
[Route("api/update")]
[ApiController]
public class UpdateController : ControllerBase
{
    private readonly AppDBContext _context;
    private readonly PasswordService _passwordService;

    public UpdateController(AppDBContext context, PasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    // POST /api/update
    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateModel model)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.CurrentEmail);
        if (existingUser == null)
        {
            return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.");
        }

        if (existingUser.Email != model.CurrentEmail)
        {
            return BadRequest("E-posta adresi doğrulanamadı.");
        }

        // Only update if Password is provided
        if (!string.IsNullOrEmpty(model.CurrentPassword))
        {
            // Validate the current password
            if (!_passwordService.VerifyPassword(model.CurrentPassword, existingUser.Password_Hash, existingUser.Password_Salt))
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

        await _context.SaveChangesAsync();

        return Ok(new { message = "Kullanıcı bilgileri başarıyla güncellendi." });
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

        if (existingUser.Email != model.CurrentEmail)
        {
            return BadRequest("E-posta adresi doğrulanamadı.");
        }

        // Validate the current password
        if (!_passwordService.VerifyPassword(model.CurrentPassword, existingUser.Password_Hash, existingUser.Password_Salt))
        {
            return BadRequest("Geçersiz mevcut şifre.");
        }

        // Validate the new password
        var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$";
        if (!Regex.IsMatch(model.Password, passwordPattern))
        {
            return BadRequest("Şifre en az 8 karakterden oluşmalı, en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
        }

        // Hash the new password
        var (hashedPassword, salt) = _passwordService.HashPassword(model.Password);

        // Store the hashed password and the salt
        existingUser.Password_Hash = hashedPassword;
        existingUser.Password_Salt = salt;

        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();

        return Ok("Şifre başarıyla güncellendi.");

    }
}

