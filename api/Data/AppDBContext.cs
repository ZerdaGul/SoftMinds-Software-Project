using Microsoft.EntityFrameworkCore;
using api.Models; // Model sınıflarının bulunduğu namespace

namespace api.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        // Mevcut tabloları temsil eden DbSet'ler
        public DbSet<Products> Products { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> Order_Items { get; set; }
        public DbSet<Comments> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Veritabanında zaten var olan tabloları ayarla
            modelBuilder.Entity<Products>().ToTable("products");
            modelBuilder.Entity<Users>().ToTable("users");
            modelBuilder.Entity<Orders>().ToTable("orders");
            modelBuilder.Entity<OrderItems>().ToTable("order_items");
            modelBuilder.Entity<Comments>().ToTable("comments");

            // Ek olarak, her tabloya özel ilişkiler veya yapılandırmalar ekle
            // Örnek: modelBuilder.Entity<Product>().Property(p => p.Name).HasMaxLength(100);

            // Add indexes
            modelBuilder.Entity<Products>()
                .HasIndex(p => p.Sector)
                .HasDatabaseName("IX_Products_Sector");

            modelBuilder.Entity<Products>()
                .HasIndex(p => p.Price)
                .HasDatabaseName("IX_Products_Price");

            modelBuilder.Entity<Products>()
                .HasIndex(p => p.Stock)
                .HasDatabaseName("IX_Products_Stock");

            modelBuilder.Entity<Products>()
                .HasIndex(p => p.Name)
                .HasDatabaseName("IX_Products_Name");
        }
    }
}