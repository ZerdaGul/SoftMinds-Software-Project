namespace api.DTO
{
    public class ReviewDTO
    {
        public required string ReviewText { get; set; } = null!;
        public required int Rating { get; set; } = 0;
    }
}