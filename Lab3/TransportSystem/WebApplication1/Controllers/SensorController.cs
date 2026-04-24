using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SensorController(AppDbContext context) => _context = context;

        // обн где знах поезд
        
        [HttpPost("update")]
        public async Task<IActionResult> UpdateLocation(
    [FromQuery] int trainId,
    [FromQuery] int stationId,
    [FromQuery] string actualTime)
        {
              
            var train = await _context.Trains
                .Include(t => t.Route)
                .FirstOrDefaultAsync(t => t.Id == trainId);

            if (train == null) return NotFound("Поїзд не знайдено");

            // поиск в распис станц
            var schedule = train.Route.FirstOrDefault(rs => rs.StationId == stationId);

            if (schedule != null)
            {
                train.CurrentStationId = stationId; //местопол

                // задержка мат
                if (TimeSpan.TryParse(actualTime, out var tActual) &&
                    TimeSpan.TryParse(schedule.ScheduledArrival, out var tScheduled))
                {
                    int delay = (int)(tActual - tScheduled).TotalMinutes;
                    train.DelayMinutes = delay > 0 ? delay : 0;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new
            {
                status = "Дані отримано від датчика",
                train = train.Number,
                delay = train.DelayMinutes
            });
        }
    }
}