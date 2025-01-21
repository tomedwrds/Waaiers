using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class PostRequestRoute
{
    public required RouteItem Route { get; set; }
    public required List<PostRequestPoints> Points { get; set; }
}

public class RouteItem
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required bool IsDisplayed { get; set; }
    public required DateTime RaceDateTime { get; set; }

}


[Table("Routes")]
public class RouteModel : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }
    [Column("name")]
    public string Name { get; set; }
    [Column("displayed")]
    public bool Displayed { get; set; }
    [Column("date")]
    public DateTime Date { get; set; }

}



public class RouteStausUpdate
{
    public required long Id { get; set; }
    public required bool IsDisplayed { get; set; }
}