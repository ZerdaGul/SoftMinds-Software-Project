using Microsoft.EntityFrameworkCore;
using api.Models; // Model sınıflarının bulunduğu namespace

namespace api.Data
{
    public class AppDBContext(DbContextOptions<AppDBContext> options) : DbContext(options)
    {

        // Mevcut tabloları temsil eden DbSet'ler
        public required DbSet<Products> Products { get; set; }
        public required DbSet<Users> Users { get; set; }
        public required DbSet<Orders> Orders { get; set; }
        public required DbSet<OrderItem> OrderItems { get; set; }
        public required DbSet<Comments> Comments { get; set; }
        public required DbSet<Questions> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Veritabanında zaten var olan tabloları ayarla
            modelBuilder.Entity<Products>().ToTable("products");
            modelBuilder.Entity<Users>().ToTable("users");
            modelBuilder.Entity<Orders>().ToTable("orders");
            modelBuilder.Entity<OrderItem>().ToTable("orderitems");
            modelBuilder.Entity<Comments>().ToTable("comments");
            modelBuilder.Entity<Questions>().ToTable("questions");

            // Ek olarak, her tabloya özel ilişkiler veya yapılandırmalar ekle
            // Örnek: modelBuilder.Entity<Product>().Property(p => p.Name).HasMaxLength(100);
        }
    }
}