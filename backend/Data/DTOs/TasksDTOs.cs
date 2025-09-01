namespace TaskApi.Data.DTOs;

public class CreateTaskDTO
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; } = false;
    public DateTime? DueDate { get; set; } = null;
    public int EstimateHours { get; set; } = 0;
    public int CategoryId { get; set; } = 0;
}

public class UpdateTaskDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public bool IsDone { get; set; } = false;
    public DateTime? DueDate { get; set; } = null;
    public int EstimateHours { get; set; } = 0;
    public int CategoryId { get; set; } = 0;
}