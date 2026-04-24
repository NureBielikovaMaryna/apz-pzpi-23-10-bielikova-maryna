using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TrainsController(AppDbContext context) => _context = context;

        

        // добавить поезд по номеру
        [HttpPost("add-basic")]
        public async Task<IActionResult> AddTrain(string number, string role)
        {
            if (role != "Admin") return Forbid();

            var train = new Train { Number = number };
            _context.Trains.Add(train);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Транспорт додано", trainId = train.Id });
        }

        // Изменить номер поезда
        [HttpPut("edit-number/{id}")]
        public async Task<IActionResult> EditNumber(int id, string newNumber, string role)
        {
            if (role != "Admin") return Forbid();

            var train = await _context.Trains.FindAsync(id);
            if (train == null) return NotFound();

            train.Number = newNumber;
            await _context.SaveChangesAsync();
            return Ok("Номер змінен");
        }

        // Удалить поезд 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrain(int id, string role)
        {
            if (role != "Admin") return Forbid();

            var train = await _context.Trains.FindAsync(id);
            if (train == null) return NotFound();

            _context.Trains.Remove(train);
            await _context.SaveChangesAsync();
            return Ok("Транспорт і його розклад відалено");
        }

       
        // управление остановками поезда
        [HttpPost("add-stop-to-route")]
        public async Task<IActionResult> AddStop(int trainId, int stationId, string arrival, string departure, int order, string role)
        {
            if (role != "Admin") return Forbid();

            var stop = new RouteStop
            {
                TrainId = trainId,
                StationId = stationId,
                ScheduledArrival = arrival,
                ScheduledDeparture = departure,
                Order = order
            };

            _context.RouteStops.Add(stop);
            await _context.SaveChangesAsync();
            return Ok("Зупинка додана у транспорт");
        }

        // Редактировать время или порядок существующей остановки
        [HttpPut("schedule/edit-stop/{stopId}")]
        public async Task<IActionResult> EditStop(int stopId, string newArrival, string newDeparture, int newOrder, string role)
        {
            if (role != "Admin") return Forbid();

            var stop = await _context.RouteStops.FindAsync(stopId);
            if (stop == null) return NotFound("Остановка не знайдена");

            stop.ScheduledArrival = newArrival;
            stop.ScheduledDeparture = newDeparture;
            stop.Order = newOrder;

            await _context.SaveChangesAsync();
            return Ok("Час і порядок зупинки змінено");
        }

        // Удалить конкретную остановку
        [HttpDelete("stop/{stopId}")]
        public async Task<IActionResult> DeleteStop(int stopId, string role)
        {
            if (role != "Admin") return Forbid();

            var stop = await _context.RouteStops.FindAsync(stopId);
            if (stop == null) return NotFound();

            _context.RouteStops.Remove(stop);
            await _context.SaveChangesAsync();
            return Ok("Зупинка видалена");
        }

        
        // добавить станція
        [HttpPost("stations/create")]
        public async Task<IActionResult> CreateStation(string name, string role)
        {
            if (role != "Admin") return Forbid();

            var station = new Station { Name = name };
            _context.Stations.Add(station);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Станцію створено", stationId = station.Id });
        }

        // Отримати всі станції
        [HttpGet("stations/all")]
        public async Task<IActionResult> GetAllStations()
        {
            var stations = await _context.Stations.ToListAsync();
            return Ok(stations);
        }

        // Видалити станцію
        [HttpDelete("stations/{id}")]
        public async Task<IActionResult> DeleteStation(int id, string role)
        {
            if (role != "Admin") return Forbid();

            var station = await _context.Stations.FindAsync(id);
            if (station == null) return NotFound("Станція не знайдена");

            _context.Stations.Remove(station);
            await _context.SaveChangesAsync();

            return Ok("Станцію успішно видалено");
        }
    }
}