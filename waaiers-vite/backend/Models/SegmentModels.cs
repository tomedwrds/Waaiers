using Supabase.Functions.Responses;

namespace backend.Models;

public class SegmentPointsRPCRequest {
    public Guid route { get; set; }
    public int index_offset { get; set; }
}


public class SegmentPointsRPCResponse {
    public float latitude { get; set; }
    public float longitude { get; set; }
    public float direction { get; set; }
    public float distance_end { get; set; }
    public float distance_start { get; set; }
    public int elevation { get; set; }

    public float wind_direction { get; set; }
    public float wind_speed { get; set; }
    public float wind_speed_gust { get; set; }
}

public class ReturnedSegment {
    public List<SegmentPoints> Points { get; set; }
    public float DistanceEnd { get; set; }
    public float DistanceStart { get; set; }
    public float WindDirection { get; set; }
    public float WindSpeed { get; set; }
    public float WindSpeedGust { get; set; }
    public int Difficulty { get; set; }
}

public class SegmentPoints {
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public int Elevation { get; set; }

}