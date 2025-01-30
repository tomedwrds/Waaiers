using Supabase.Functions.Responses;

namespace backend.Models;

public class SegmentPointsRPCRequest {
    public Guid route { get; set; }
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
