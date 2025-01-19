namespace backend.Models;


public class PointItem
{
    public required Guid Id { get; set; }
    public required int Elevation { get; set; }
    public required float Latitude { get; set; }
    public required float Longitude { get; set; }
    public required float DistanceStart { get; set; }
    public required float DistanceEnd { get; set; }
    public required float Direction { get; set; }
    public required Guid WeatherID { get; set; }

}

public class PostRequestPoints 
{
    public object Ele { get; set; }
    public float Lat { get; set; }
    public float Lon { get; set; }
}
