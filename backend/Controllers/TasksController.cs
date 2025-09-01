using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Data.DTOs;
using TaskApi.Models;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // -> /api/tasks
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TasksController(AppDbContext db) => _db = db;

        // READ ALL: GET /api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
        {
            var items = await _db.Tasks
                .OrderBy(t => t.IsDone)
                .ThenBy(t => t.DueDate)
                .ToListAsync();

            return Ok(items);
        }

        // READ ONE: GET /api/tasks/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // READ TASKS FROM CATEGORY: GET /api/Tasks/{id}/fromCategory
        [HttpGet("{id:int}/fromCategory")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasksByCategory(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();

            var tasks = await _db.Tasks.Where(t => t.CategoryId == id).ToListAsync();
            return Ok(tasks);
        }

        // CREATE: POST /api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> Create(CreateTaskDTO dto)
        {
            // Title validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            // Validate category
            var category = await _db.Categories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest("Category not found.");

            // Create task
            var task = new TaskItem
            {
                Title = dto.Title,
                IsDone = dto.IsDone,
                DueDate = dto.DueDate,
                EstimateHours = dto.EstimateHours,
                CategoryId = dto.CategoryId
            };

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            // Returns 201 with Location header pointing to GET by id
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        // UPDATE: PUT /api/tasks/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateTaskDTO dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");

            // Title validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            // Validate category
            var category = await _db.Categories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest("Category not found.");

            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.IsDone = dto.IsDone;
            task.DueDate = dto.DueDate;
            task.EstimateHours = dto.EstimateHours;
            task.CategoryId = dto.CategoryId;

            await _db.SaveChangesAsync();

            // 204 No Content means success with no body
            return NoContent();
        }

        // DELETE: DELETE /api/tasks/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();

            _db.Tasks.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
