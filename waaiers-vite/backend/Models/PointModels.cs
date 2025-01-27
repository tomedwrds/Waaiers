using Supabase.Postgrest.Attributes;

using Supabase.Postgrest.Models;

namespace backend.Models;

[Table("Points")]

public class PointModel : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }
    [Column("route_id")]
    public Guid RouteId { get; set; }
    [Column("elevation")]
    public int Elevation { get; set; }
    [Column("latitude")]
    public float Latitude { get; set; }
    [Column("longitude")]
    public float Longitude { get; set; }
    [Column("distance_start")]
    public float DistanceStart { get; set; }
    [Column("distance_end")]
    public float DistanceEnd { get; set; }
    [Column("direction")]
    public float Direction { get; set; }
    [Column("weather_id")]
    public Guid WeatherId { get; set; }

}

public class PostRequestPoints 
{
    public object Ele { get; set; }
    public float Lat { get; set; }
    public float Lon { get; set; }
}
