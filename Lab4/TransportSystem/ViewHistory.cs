using System;
namespace WebApplication1.Models
{
    public class ViewHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TrainId { get; set; }
        public DateTime ViewedAt { get; set; } = DateTime.Now;
    }
}


