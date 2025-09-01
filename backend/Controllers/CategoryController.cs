using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Data.DTOs;
using TaskApi.Models;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // -> /api/tasks
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CategoriesController(AppDbContext db) => _db = db;

        // READ ALL: GET /api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAll()
        {
            var items = await _db.Categories.ToListAsync();

            return Ok(items);
        }

        // READ ONE: GET /api/Categories/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Category>> GetById(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // CREATE: POST /api/Categories
        [HttpPost]
        public async Task<ActionResult<Category>> Create(CreateCategoryDTO dto)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            // Check if category already exists
            var exists = await _db.Categories.AnyAsync(t => t.Name == dto.Name);
            if (exists) return BadRequest("Category already exists.");

            var category = new Category
            {
                Name = dto.Name
            };

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            // Returns 201 with Location header pointing to GET by id
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        // UPDATE: PUT /api/Categories/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateCategoryDTO dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");

            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;

            await _db.SaveChangesAsync();

            // 204 No Content means success with no body
            return NoContent();
        }

        // DELETE: DELETE /api/Categories/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();

            _db.Categories.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
