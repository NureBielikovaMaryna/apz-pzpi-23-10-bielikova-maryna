
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models; // Исправлено здесь

namespace WebApplication1.Data // Исправлено здесь
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<RouteStop> RouteStops { get; set; }
        public DbSet<ViewHistory> ViewHistories { get; set; }

        // Это заполнит базу данными при первом запуске
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Добавим станцию
            modelBuilder.Entity<Station>().HasData(
                new Station { Id = 1, Name = "Краснодарська" },
                new Station { Id = 2, Name = "Данілевська" },
                new Station { Id = 3, Name = "Культури" }
            );

            // Добавим поезд №12
            modelBuilder.Entity<Train>().HasData(
                new Train { Id = 1, Number = "12", CurrentStationId = 1, DelayMinutes = 0 }
            );

            // Добавим график для поезда №12
            modelBuilder.Entity<RouteStop>().HasData(
                new RouteStop { Id = 1, TrainId = 1, StationId = 1, ScheduledArrival = "10:00", ScheduledDeparture = "10:10", Order = 1 },
                new RouteStop { Id = 2, TrainId = 1, StationId = 2, ScheduledArrival = "11:30", ScheduledDeparture = "11:35", Order = 2 }
            );
        }
    }
}



