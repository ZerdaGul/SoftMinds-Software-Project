namespace api.DTO
{
    public class ProductAdminDTO
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; } = 0;
        public string Description { get; set; } = null!;
        public int Stock { get; set; }
        public string Sector { get; set; } = null!;
    }
    
    
}