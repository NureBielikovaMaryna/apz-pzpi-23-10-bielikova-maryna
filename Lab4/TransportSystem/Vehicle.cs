using System;

namespace TransportSystem.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string VehicleNumber { get; set; } // Номер (например, "AA 1234")
        public string SensorId { get; set; }      // ID датчика из Wokwi
    }
}