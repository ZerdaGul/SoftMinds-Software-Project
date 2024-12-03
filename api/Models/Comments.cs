
using System.Text.Json.Serialization;

namespace api.Models;

public class Comments
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public required string Text { get; set; } = null!;
    public DateTime Created_At { get; set; }

    [JsonIgnore]
    public Users? User { get; set; }
    
    [JsonIgnore]
    public Products? Product { get; set; }

}


