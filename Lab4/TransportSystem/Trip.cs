using System;

using System;

namespace TransportSystem.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }         // Связь с транспортом
        public DateTime StartTime { get; set; }    // Когда выехал
        public DateTime? EndTime { get; set; }     // Когда приехал (может быть пустым, если еще едет)
        public string RouteName { get; set; }      // Название маршрута
    }
}

