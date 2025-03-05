using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class PostRequestRoute
{
    public required string Name { get; set; }
    public required DateTime Date { get; set; }
    public required List<PostRequestPoints> Points { get; set; }
}

public class ResponseRoute
{
    public required Guid Id { get; set; }
    public required string RouteName { get; set; }
    public required int Displayed { get; set; }
    public required DateTime Date { get; set; }
    public required float Distance { get; set; }

}


[Table("Routes")]
public class RouteModel : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }
    [Column("name")]
    public string Name { get; set; }
    [Column("displayed")]
    public int Displayed { get; set; }
    [Column("date")]
    public DateTime Date { get; set; }
    [Column("distance")]
    public float Distance { get; set; }

}



public class RouteStausUpdate
{
    public required Guid Id { get; set; }
    public required int DisplayStatus { get; set; }
}