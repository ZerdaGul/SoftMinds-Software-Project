using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace api.Services
{
    public class EmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string fromEmail, string subject, string body, bool isBodyHtml = false)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = isBodyHtml,
            };
            mailMessage.To.Add(toEmail);

            using (var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort))
            {
                client.Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                client.EnableSsl = true;
                await client.SendMailAsync(mailMessage);
            }
        }

        public async Task SendVerificationEmail(string toEmail, string verificationLink)
        {
            var subject = "Email Verification";
            var body = $"Please verify your email by clicking on the following link: {verificationLink}";
            await SendEmailAsync(toEmail, _emailSettings.SenderEmail, subject, body);
        }

        public async Task SendSupportRequestEmail(string fromEmail, string name, string message)
        {
            var subject = "New Support Request";
            var body = $"You have a new support request:\n\nName: {name}\nEmail: {fromEmail}\nMessage:\n{message}";
            await SendEmailAsync(_emailSettings.SenderEmail, fromEmail, subject, body, false);
        }

        public async Task SendForgotPasswordEmail(string toEmail, string token)
        {
            var subject = "Şifre Sıfırlama Talebi";
            var body = $"Şifrenizi sıfırlamak için lütfen aşağıdaki kodu 1 saat içinde kullanın:\n{token}";
            await SendEmailAsync(toEmail, _emailSettings.SenderEmail, subject, body);
        }
    }
}