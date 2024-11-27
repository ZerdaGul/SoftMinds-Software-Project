using Microsoft.AspNetCore.Mvc;
using api.DTO;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using api.Models;

namespace api.Controller
{
    [Route("api/")]
    [ApiController]
    public class SupportController : ControllerBase
    {
        private readonly IOptions<EmailSettings> _emailSettings;

        public SupportController(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings;
        }

        [HttpPost("support-request")]
        public async Task<IActionResult> SubmitSupportRequest([FromBody] SupportRequestDTO model)
        {
            // Verilen model null veya gerekli alanlar eksikse hata döndür
            if (model == null || string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Message))
            {
                return BadRequest("All fields are necessary.");
            }

            try
            {
                // E-posta gönderme işlemi
                await SendSupportRequestEmail(model);
                return Ok(new { message = "Your support request has been sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending email: {ex.Message}");
            }
        }

        private async Task SendSupportRequestEmail(SupportRequestDTO model)
        {
            // E-posta mesajını oluştur
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(model.Name, model.Email)); // Gönderen: Kullanıcı adı ve e-posta
            message.To.Add(new MailboxAddress("Support Team", _emailSettings.Value.SenderEmail)); // Alıcı: Şirketin destek e-posta adresi
            message.Subject = "New Support Request"; // E-posta başlığı

            // E-posta gövdesi
            message.Body = new TextPart("plain")
            {
                Text = $"You have a new support request:\n\nAd: {model.Name}\nE-mail: {model.Email}\nMessage:\n{model.Message}"
            };

            // SMTP ile e-posta gönder
            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettings.Value.SmtpServer, _emailSettings.Value.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.Value.SmtpUsername, _emailSettings.Value.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}