
namespace api.Models;

public class Comments
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public required string Text { get; set; } = null!;
    public DateTime Created_At { get; set; }

    public required Users User { get; set; } = null!;
    public required Products Product { get; set; } = null!;

}


