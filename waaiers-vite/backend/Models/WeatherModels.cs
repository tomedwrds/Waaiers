using Supabase.Postgrest.Attributes;

using Supabase.Postgrest.Models;

namespace backend.Models;

[Table("Weather")]

public class WeatherModel : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }
    [Column("route_id")]
    public Guid RouteId { get; set; }
    [Column("wind_speed_gust")]
    public float WindSpeedGust { get; set; }
    [Column("wind_speed")]
    public float WindSpeed { get; set; }
    [Column("wind_direction")]
    public float WindDirection { get; set; }
    [Column("latitude")]
    public float Latitude { get; set; }
    [Column("longitude")]
    public float Longitude { get; set; }

}

public class OpenMeteoResponseFormat {
    public required float latitude { get; set; }
    public required float longitude { get; set; }
    public required float generationtime_ms { get; set; }
    public required int utc_offset_seconds { get; set; }
    public required string timezone { get; set; }

    public required string timezone_abbreviation { get; set; }

    public required float elevation { get; set; }
    public required OpenMeteoHourlyUnits hourly_units { get; set; }
    public required OpenMeteoHourly hourly { get; set; }
}

public class OpenMeteoHourlyUnits {
    public required string time { get; set; }
    public required string windspeed_10m { get; set; }
    public required string winddirection_10m { get; set; }
    public required string windgusts_10m { get; set; }
}

public class OpenMeteoHourly {
    public required List<string> time { get; set; } 
    public required List<float> windspeed_10m { get; set; } 
    public required List<int> winddirection_10m { get; set; } 
    public required List<float> windgusts_10m { get; set; } 
    
}
