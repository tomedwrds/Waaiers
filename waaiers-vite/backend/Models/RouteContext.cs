using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class RouteContext : DbContext
{
    public RouteContext(DbContextOptions<RouteContext> options)
        : base(options)
    {
    }

    public DbSet<RouteItem> RouteItems { get; set; } = null!;
}