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
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Comments> Comments { get; set; }
        public DbSet<Reviews> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Veritabanında zaten var olan tabloları ayarla
            modelBuilder.Entity<Products>().ToTable("products");
            modelBuilder.Entity<Users>().ToTable("users");
            modelBuilder.Entity<Orders>().ToTable("orders");
            modelBuilder.Entity<OrderItem>().ToTable("orderitems");
            modelBuilder.Entity<Comments>().ToTable("comments");
            modelBuilder.Entity<Reviews>().ToTable("reviews");

            // Ek olarak, her tabloya özel ilişkiler veya yapılandırmalar ekle
            // Örnek: modelBuilder.Entity<Product>().Property(p => p.Name).HasMaxLength(100);
        }
    }
}