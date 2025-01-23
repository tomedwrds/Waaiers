using Supabase.Postgrest.Attributes;

using Supabase.Postgrest.Models;

namespace backend.Models;

[Table("Points")]

public class PointModel : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }
    [Column("elevation")]
    public int Elevation { get; set; }
    [Column("latitude")]
    public float Latitude { get; set; }
    [Column("longitude")]
    public float Longitude { get; set; }
    [Column("distancestart")]
    public float DistanceStart { get; set; }
    [Column("distanceend")]
    public float DistanceEnd { get; set; }
    [Column("direction")]
    public float Direction { get; set; }

}

public class PostRequestPoints 
{
    public object Ele { get; set; }
    public float Lat { get; set; }
    public float Lon { get; set; }
}
