namespace api.Models;

public class Users
{
    public int Id { get; set; }
    public required string Name { get; set; } = null!;

    public required string Email { get; set; } = null!;
    public required string Password_Hash { get; set; } = null!;// Hash'lenmiş şifre
    public required string Password_Salt { get; set; } = null!;// Kullanıcıya özel tuz

    public DateTime Created_At { get; set; }  // Kullanıcı oluşturulma tarihi

    public required string Country { get; set; } = null!;
    public required string Phone { get; set; } = null!;

    public int Failed_Login_Attempts { get; set; } = 0; // Başarısız giriş denemeleri
    public DateTime? Lockout_End { get; set; } // Hesap kilitlenme süresi

    public bool Is_Email_Verified { get; set; } = false; // E-posta doğrulama durumu
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
    // Relationships
    public List<Orders> Orders { get; set; } = []; // Orders listesi, boş olabilir
    public List<Comments> Comments { get; set; } = [];// boş olabilir

}