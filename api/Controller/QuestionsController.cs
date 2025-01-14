using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DTO;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Services;

namespace api.Controllers
{
    [Route("api/questions")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly UserService _userService;

        public QuestionsController(AppDBContext context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        // Kullanıcının oturum bilgisinden UserId'yi al
        private int? GetCurrentUserId()
        {
            return _userService.GetCurrentUserId();
        }

        // 1. Müşterinin soru sorması (POST /api/questions/customer)
        [HttpPost("customer")]
        public async Task<IActionResult> AskQuestion([FromBody] AskQuestionDto askQuestionDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User session not found." });
            }

            if (_userService.GetRole() != "customer")
            {
                return Forbid("You are not authorized to perform this action.");
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

            return Ok(new { message = "The question has been saved successfully." });
        }

        // 2. Müşterinin sorduğu soruları görüntülemesi (GET /api/questions/customer)
        [HttpGet("customer")]
        public async Task<IActionResult> GetCustomerQuestions()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User session not found." });
            }

            if (_userService.GetRole() != "customer")
            {
                return Forbid("You are not authorized to perform this action.");
            }

            var questions = await _context.Questions
                .Where(q => q.UserId == userId.Value)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "No questions found." });
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
                return NotFound(new { message = "No questions found." });
            }

            if (_userService.GetRole() != "padmin" && _userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }

            question.Answer_Text = answerQuestionDto.AnswerText;
            question.Answered_At = DateTime.UtcNow;

            _context.Questions.Update(question);
            await _context.SaveChangesAsync();

            return Ok(new { message = "The answer has been saved successfully." });
        }

        // 4. Admin'in tüm soruları ve cevapları görüntülemesi (GET /api/questions/admin)
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllQuestions()
        {
            if (_userService.GetRole() != "padmin" && _userService.GetRole() != "oadmin")
            {
                return Forbid("You are not authorized to perform this action.");
            }

            var questions = await _context.Questions
                .Include(q => q.User) // Kullanıcı bilgileriyle birlikte soruları getir
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "No questions found." });
            }

            return Ok(questions);

        }
    }
}