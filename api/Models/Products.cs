namespace api.Models;

public class Products
{
    public int Id { get; set; }
    public required string Name { get; set; } = null!;
    public required string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public required string Sector { get; set; } = null!;

    // Relationships
    public List<OrderItems> Order_Items { get; set; } = [];//can be empty.
    public List<Comments> Comments { get; set; } = []; //can be empty.
    public List<Reviews> Reviews { get; set; } = new List<Reviews>(); // can be empty

}
