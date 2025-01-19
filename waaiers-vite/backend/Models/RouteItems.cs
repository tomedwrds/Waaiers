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

public class RouteStausUpdate
{
    public required long Id { get; set; }
    public required bool IsDisplayed { get; set; }
}