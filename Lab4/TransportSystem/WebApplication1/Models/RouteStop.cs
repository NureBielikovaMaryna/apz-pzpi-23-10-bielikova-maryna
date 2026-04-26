using System;
namespace WebApplication1.Models
{
    public class RouteStop
    {
        public int Id { get; set; }
        public int TrainId { get; set; }
        public int StationId { get; set; }
        public Station Station { get; set; } // Для получения названия станции

        public string ScheduledArrival { get; set; } // "14:00"
        public string ScheduledDeparture { get; set; } // "14:10"
        public int Order { get; set; } // Порядковый номер 
    }
}
