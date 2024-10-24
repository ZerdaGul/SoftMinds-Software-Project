using System;

namespace api.Models;

public class Comments
{
    public int Id { get; set; }
    public int User_Id { get; set; }
    public int  Product_Id { get; set; }
    public required string Text { get; set; }=null!;
    public DateTime Order_Date { get; set; }

    public required Users User { get; set; }= null!;
    public required Products Product { get; set; }= null!;

}


