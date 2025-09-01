namespace TaskApi.Data.DTOs;

public class CreateCategoryDTO
{
    public required string Name { get; set; }
}

public class UpdateCategoryDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
}