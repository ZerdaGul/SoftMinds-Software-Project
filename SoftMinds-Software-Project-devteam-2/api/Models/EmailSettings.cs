namespace api.Models
{
    public class EmailSettings
    {
        public required string SmtpServer { get; set; } = null!;
        public required int SmtpPort { get; set; }
        public required string SmtpUsername { get; set; } = null!;
        public required string SmtpPassword { get; set; } = null!;
        public required string SenderEmail { get; set; } = null!;
        public required string SenderName { get; set; } = null!;
    }
}