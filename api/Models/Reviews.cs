namespace api.Models;
public class Reviews
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public required string ReviewText { get; set; } = null!;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    // Relationships
    public Products Product { get; set; } = null!;
    public Users User { get; set; } = null!;
}