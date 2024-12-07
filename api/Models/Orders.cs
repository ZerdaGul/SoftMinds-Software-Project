using System.Text.Json.Serialization;

namespace api.Models
{
    public class Orders
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Total_Price { get; set; }
        public DateTime Order_Date { get; set; }
        public required string State { get; set; } = null!;

        // Relationships
        [JsonIgnore]
        public Users? User { get; set; }
        
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); //should not be empty.
    }
}