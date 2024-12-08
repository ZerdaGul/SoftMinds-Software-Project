namespace api.DTO
{
    public class AnswerQuestionDto
    {
        public int QuestionId { get; set; }   // Cevaplanacak sorunun ID'si
        public required string AnswerText { get; set; } // Admin'in cevabı
    }
}