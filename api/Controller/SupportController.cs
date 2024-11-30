using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using api.Services;

using System;
using System.Threading.Tasks;
using api.DTO;

namespace api.Controllers
{
    [Route("api/support")]
    [ApiController]
    public class SupportController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ILogger<SupportController> _logger;

        public SupportController(EmailService emailService, ILogger<SupportController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SendSupportRequest([FromBody] SupportRequestDTO model)
        {
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
                _logger.LogError(ex, "An error occurred while sending email.");
                return StatusCode(500, $"An error occurred while sending email: {ex.Message}");
            }
        }

        private async Task SendSupportRequestEmail(SupportRequestDTO model)
        {
            await _emailService.SendSupportRequestEmail(model.Email, model.Name, model.Message);
        }
    }
}