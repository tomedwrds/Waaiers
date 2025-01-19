namespace backend.Models;


public class PointItem
{
    public required Guid Id { get; set; }
    public required int Elevation { get; set; }
    public required float Latitude { get; set; }
    public required float Longitude { get; set; }

}

public class PointItems
{
    public required List<PointItem> Points { get; set; }

}
