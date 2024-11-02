namespace api.DTO
{
    public class ResetPasswordDTO
    {
        public required string Token { get; set; } = null!;
        public required string NewPassword { get; set; } = null!;
    }
}