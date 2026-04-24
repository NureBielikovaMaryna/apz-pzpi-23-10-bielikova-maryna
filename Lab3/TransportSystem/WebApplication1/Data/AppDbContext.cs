
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models; 

namespace WebApplication1.Data 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<RouteStop> RouteStops { get; set; }
        public DbSet<ViewHistory> ViewHistories { get; set; }

        // гот база
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Станции
            modelBuilder.Entity<Station>().HasData(
                new Station { Id = 1, Name = "Велозаводська" },
                new Station { Id = 2, Name = "Краснодарська" },
                new Station { Id = 3, Name = "Сумська" },
                new Station { Id = 4, Name = "Культури" },
                new Station { Id = 5, Name = "Трінклера" }
            );

            // 5 поездов
            modelBuilder.Entity<Train>().HasData(
                new Train { Id = 1, Number = "12", CurrentStationId = 1, DelayMinutes = 0 },
                new Train { Id = 2, Number = "705", CurrentStationId = 2, DelayMinutes = 10 },
                new Train { Id = 3, Number = "81", CurrentStationId = 1, DelayMinutes = 0 },
                new Train { Id = 4, Number = "105", CurrentStationId = 3, DelayMinutes = 5 },
                new Train { Id = 5, Number = "43", CurrentStationId = 1, DelayMinutes = 0 }
            );

            // График Поезда 12 и 3 станции
            modelBuilder.Entity<RouteStop>().HasData(
                new RouteStop { Id = 1, TrainId = 1, StationId = 1, ScheduledArrival = "08:00", ScheduledDeparture = "08:15", Order = 1 },
                new RouteStop { Id = 2, TrainId = 1, StationId = 2, ScheduledArrival = "09:30", ScheduledDeparture = "09:35", Order = 2 },
                new RouteStop { Id = 3, TrainId = 1, StationId = 3, ScheduledArrival = "11:00", ScheduledDeparture = "11:10", Order = 3 }
            );
        }
    }
}



