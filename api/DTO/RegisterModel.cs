namespace api.DTO;

public class RegisterModel
{
    public required string Name { get; set; }=null!;
    public required string Email { get; set; }=null!;
    public required string Password { get; set; }=null!;
    public  required string Phone { get; set; }= null!;
    public required string Country { get; set; }= null!;
}