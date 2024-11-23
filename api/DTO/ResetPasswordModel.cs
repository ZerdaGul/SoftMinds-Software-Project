namespace api.DTO;

public class ResetPasswordModel
{
    public required string CurrentEmail { get; set; } = null!;
    public required string CurrentPassword { get; set; } = null!;

    public required string Password { get; set; } = null!;
    public required string ConfirmPassword { get; set; } = null!;
}
