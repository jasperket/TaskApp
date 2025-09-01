using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace TaskApi.Models;

public class Category
{
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public required string Name { get; set; } = "";

    public ICollection<TaskItem> Tasks { get; } = new List<TaskItem>();
}