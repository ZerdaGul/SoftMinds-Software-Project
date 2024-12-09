using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DTO;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using api.Data;

namespace api.Controllers
{
    [Route("api/questions")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public QuestionsController(AppDBContext context)
        {
            _context = context;
        }

        // Kullanıcının oturum bilgisinden UserId'yi al
        private int? GetCurrentUserId()
        {
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var idClaim = jsonToken?.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;

            return int.TryParse(idClaim, out var userId) ? userId : null;
        }

        // 1. Müşterinin soru sorması (POST /api/questions/customer)
        [HttpPost("customer")]
        public async Task<IActionResult> AskQuestion([FromBody] AskQuestionDto askQuestionDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Kullanıcı oturumu bulunamadı." });
            }

            var question = new Questions
            {
                UserId = userId.Value,
                Question_Text = askQuestionDto.QuestionText,
                Created_At = DateTime.UtcNow,
                Answer_Text = null,
                Answered_At = null
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Soru başarıyla kaydedildi." });
        }

        // 2. Müşterinin sorduğu soruları görüntülemesi (GET /api/questions/customer)
        [HttpGet("customer")]
        public async Task<IActionResult> GetCustomerQuestions()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Kullanıcı oturumu bulunamadı." });
            }

            var questions = await _context.Questions
                .Where(q => q.UserId == userId.Value)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "Herhangi bir soru bulunamadı." });
            }

            return Ok(questions);
        }

        // 3. Admin'in sorulara cevap vermesi (POST /api/questions/admin/answer)
        [HttpPost("admin/answer")]
        public async Task<IActionResult> AnswerQuestion([FromBody] AnswerQuestionDto answerQuestionDto)
        {
            var question = await _context.Questions
                .FirstOrDefaultAsync(q => q.Id == answerQuestionDto.QuestionId);

            if (question == null)
            {
                return NotFound(new { message = "Soru bulunamadı." });
            }

            question.Answer_Text = answerQuestionDto.AnswerText;
            question.Answered_At = DateTime.UtcNow;

            _context.Questions.Update(question);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cevap başarıyla kaydedildi." });
        }

        // 4. Admin'in tüm soruları ve cevapları görüntülemesi (GET /api/questions/admin)
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllQuestions()
        {
            var questions = await _context.Questions
                .Include(q => q.User) // Kullanıcı bilgileriyle birlikte soruları getir
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "Herhangi bir soru bulunamadı." });
            }

            return Ok(questions);
        }
    }
}