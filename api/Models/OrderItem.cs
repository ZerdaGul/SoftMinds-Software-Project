using System.Text.Json.Serialization;

namespace api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Total_Price { get; set; }

        // Relationships
        [JsonIgnore]
        public Orders? Order { get; set; }
        public Products? Product { get; set; }
    }
}