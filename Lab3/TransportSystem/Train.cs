using System;
namespace WebApplication1.Models
{
    public class Train
    {
        public int Id { get; set; }
        public string Number { get; set; } // Например, "12"
        public int? CurrentStationId { get; set; } // Текущая станция (от датчика)
        public int DelayMinutes { get; set; } // Задержка (в минутах)

        // Список остановок (маршрут)
        public List<RouteStop> Route { get; set; } = new();
    }
}

