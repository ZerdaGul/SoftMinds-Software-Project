namespace api.Models;

public class Orders
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Total_Price { get; set; }
    public DateTime Order_Date { get; set; }
    public required string State { get; set; }= null!;

    // Relationships
    public required Users User { get; set; } = null!;
    public List<OrderItems> Order_Items { get; set; } = []; //should not be empty.
}