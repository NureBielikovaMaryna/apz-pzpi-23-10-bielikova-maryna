using System;

namespace WebApplication1.Models
{
    public class ViewHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TrainId { get; set; }

        // ВОТ ЭТОЙ СТРОЧКИ НЕ ХВАТАЛО:
        // Она говорит базе данных: "Привяжи сюда данные из таблицы Trains"
        public Train Train { get; set; }

        public DateTime ViewedAt { get; set; } = DateTime.Now;
    }
}

