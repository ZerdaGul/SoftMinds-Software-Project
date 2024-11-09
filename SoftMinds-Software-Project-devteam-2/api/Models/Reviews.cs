namespace api.Models;
public class Reviews
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public required string ReviewText { get; set; } = null!;
    public int Rating { get; set; }

    // Relationships
    public Products Product { get; set; } = null!;
}