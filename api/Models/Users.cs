namespace api.Models;

public class Users
{
    public int Id{get;set;}
    public required string Name { get; set; } = null!;  

    public required string Email{get;set;}= null!;
    public required string Password{get;set;}= null!;

    public DateTime Created_At { get; set; }  // Kullanıcı oluşturulma tarihi

    public required string Country { get; set; } = null!; 
    public required string Phone{get;set;}= null!;

    // Relationships
    public List<Orders> Orders { get; set; } = []; // Orders listesi, boş olabilir
    public List<Comments> Comments{get;set;}=[];// boş olabilir
 
}