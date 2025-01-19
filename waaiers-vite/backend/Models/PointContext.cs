using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class PointContext : DbContext
{
    public PointContext(DbContextOptions<PointContext> options)
        : base(options)
    {
    }

    public DbSet<PointItem> PointItems { get; set; } = null!;
}