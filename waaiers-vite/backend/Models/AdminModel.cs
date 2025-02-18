using Supabase.Postgrest.Attributes;

using Supabase.Postgrest.Models;

namespace backend.Models;
[Table("Admins")]

public class AdminModel : BaseModel
{
    [PrimaryKey("uuid")]
    public Guid Uuid { get; set; }
}