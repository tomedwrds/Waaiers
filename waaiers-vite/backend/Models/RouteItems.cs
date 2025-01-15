namespace backend.Models;

public class RouteItem
{
    public required long Id { get; set; }
    public required string Name { get; set; }
    public required bool IsDisplayed { get; set; }
    public required DateTime RaceDateTime { get; set; }

}

public class RouteStausUpdate
{
    public required long Id { get; set; }
    public required bool IsDisplayed { get; set; }
}