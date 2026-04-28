using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context) => _context = context;

        // рег
        [HttpPost("register")]
        public async Task<IActionResult> Register(string name, string email, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return BadRequest("Користувач з такою поштою вже є!");

            var newUser = new User { Name = name, Email = email, Password = password };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Реєстрація успішна!", userId = newUser.Id });
        }

        // вхід
        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
            if (user == null) return Unauthorized("Неправильна пошта або пароль");

            string role = (email == "admin@test.com") ? "Admin" : "Client";
            return Ok(new { message = $"Вітаю, {user.Name}!", userId = user.Id, role = role });
        }

        

        // запис просм 
        [HttpPost("view")]
        public async Task<IActionResult> RecordView(int userId, int trainId)
        {
            var history = new ViewHistory { UserId = userId, TrainId = trainId, ViewedAt = DateTime.Now };
            _context.ViewHistories.Add(history);
            await _context.SaveChangesAsync();
            return Ok("Запис додано в історію");
        }

        // історія
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetHistory(int userId)
        {
            var history = await _context.ViewHistories
                .Where(h => h.UserId == userId)
                // презд
                .Include(h => h.Train)
                    // его маршрут
                    .ThenInclude(t => t.Route)
                        // названия станций
                        .ThenInclude(rs => rs.Station)
                .Select(h => new {
                    ViewedAt = h.ViewedAt.ToString("g"), 
                    TrainNumber = h.Train.Number,
                    
                    Stops = h.Train.Route.OrderBy(r => r.Order).Select(r => new {
                        StationName = r.Station.Name,
                        Arrival = r.ScheduledArrival,
                        Departure = r.ScheduledDeparture
                    })
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}