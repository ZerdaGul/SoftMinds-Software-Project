using System.Text.Json.Serialization;

namespace api.Models
{
    public class Questions
    {
        public int Id { get; set; } // Soru ID'si
        public int UserId { get; set; } // Soruyu soran kullanıcının ID'si
        public required string Question_Text { get; set; } = null!; // Sorunun içeriği
        public string? Answer_Text { get; set; } // Admin'in cevabı
        public DateTime Created_At { get; set; } // Sorunun oluşturulma zamanı
        public DateTime? Answered_At { get; set; } // Admin'in soruya cevap verdiği zaman (nullable)

        // Relationships
        [JsonIgnore]
        public Users? User { get; set; } // Soruyu soran kullanıcı ile ilişki
    }
}