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
using System;
using System.Text;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Options;

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
        if (!string.IsNullOrEmpty(model.Password))
        {

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
        }
        if (!string.IsNullOrEmpty(model.Email))
        {
            
            existingUser.Email = model.Email;
        }

        if (!string.IsNullOrEmpty(model.Phone))
        {
            var phonePattern = @"^(\+90[\s]?)?[0-9]{3}[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$";
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


[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
{
    // Ensure the password field is provided
    if (string.IsNullOrEmpty(model.Password))
    {
        return BadRequest("Yeni şifre gereklidir.");
    }

    // Validate password strength
    var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$";
    if (!Regex.IsMatch(model.Password, passwordPattern))
    {
        return BadRequest("Şifre en az 8 karakterden oluşmalı, en az bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
    }

   
    var userId = model.Password;
    var existingUser = await _context.Users.FindAsync(userId);
    if (existingUser == null)
    {
        return BadRequest("Kullanıcı bulunamadı.");
    }

    // Generate a new salt for hashing
    byte[] salt = new byte[128 / 8];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(salt);
    }

    // Hash the password using the new salt
    string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: model.Password,
        salt: salt,
        prf: KeyDerivationPrf.HMACSHA256,
        iterationCount: 100000,
        numBytesRequested: 256 / 8));

    // Update the user's password and salt
    existingUser.Password_Hash = hashedPassword;
    existingUser.Password_Salt = Convert.ToBase64String(salt);

    _context.Users.Update(existingUser);
    await _context.SaveChangesAsync();

    return Ok("Şifre başarıyla sıfırlandı.");
}


[HttpPost("request-password-reset")]
    public async Task<IActionResult> RequestPasswordReset([FromBody] ResetPasswordMailModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.Email))
        {
            return BadRequest("E-posta alanı gereklidir.");
        }

        var emailValidator = new EmailAddressAttribute();
        if (!emailValidator.IsValid(model.Email))
        {
            return BadRequest("Geçersiz email adresi.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (existingUser == null)
        {
            return BadRequest("Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.");
        }

        // Construct reset URL to direct the user to the reset password page
        var resetUrl = "https://your-domain.com/reset-password"; // Adjust this to your frontend reset page

        // Send email with reset instructions
        await SendResetEmail(existingUser.Email, resetUrl);

        return Ok("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    }

    private async Task SendResetEmail(string email, string resetUrl)
    {
        using (var smtpClient = new SmtpClient())
        {
            // Configure SMTP client using settings
            smtpClient.Host = _smtpSettings.Host;
            smtpClient.Port = _smtpSettings.Port;
            smtpClient.EnableSsl = _smtpSettings.EnableSsl;
            smtpClient.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);

            // Create the email message
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.Username),
                Subject = "Şifre Sıfırlama İsteği",
                Body = $"Lütfen aşağıdaki bağlantıyı kullanarak şifrenizi sıfırlayın: <a href='{resetUrl}'>{resetUrl}</a>",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(email);

            // Send the email
            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine("SMTP Exception: " + smtpEx.Message);
                throw new Exception("There was a problem sending the email. Please try again later.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("General Exception: " + ex.Message);
                throw new Exception("An unexpected error occurred. Please contact support.");
            }
        }
    }
    }

