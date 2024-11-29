namespace api.DTO;
using System.ComponentModel.DataAnnotations;

public class RegisterModel
{
    [Required(ErrorMessage = "Name is required.")]
    [RegularExpression(@"^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$", ErrorMessage = "Name can only contain letters and spaces.")]
    public required string Name { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$", ErrorMessage = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.")]
    public required string Password { get; set; }

    [Required(ErrorMessage = "Phone is required.")]
    [RegularExpression(@"^\d{11,12}$", ErrorMessage = "Phone number must be 11-12 digits long.")]
    public required string Phone { get; set; }

    [Required(ErrorMessage = "Country is required.")]
    public required string Country { get; set; }
}