using System.Reflection.Metadata;
using System.Text.Json.Serialization;

namespace api.Models;

public class Products
{
    public int Id { get; set; }
    public required string Name { get; set; } = null!;
    public required string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public required string Sector { get; set; } = null!;

    public byte[]? Photo { get; set; }
    public string? ContentType { get; set; }

    // Relationships
    public List<Comments> Comments { get; set; } = []; //can be empty.

}
