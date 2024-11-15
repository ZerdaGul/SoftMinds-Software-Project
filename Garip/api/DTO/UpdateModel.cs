namespace api.DTO;

public class UpdateModel
{

    public required string Name { get; set; } = null!;
    public required string CurrentEmail { get; set; } = null!;
    public string? Email { get; set; }
    public string? CompanyName { get; set; }
    public required string CurrentPassword { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Country { get; set; }
}
