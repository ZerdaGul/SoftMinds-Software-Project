namespace api.Models;

public class OrderItems
{
    public int Id { get; set; }
    public int OrdersId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Total_Price { get; set; }

    // Relationships
    public required Orders Order { get; set; } = null!;
    public required Products Product { get; set; } = null!;
}
