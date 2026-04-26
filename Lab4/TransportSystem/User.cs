using System;
namespace WebApplication1.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // В лабе храним просто текстом для простоты
        public bool IsAdmin { get; set; } // true — админ, false — обычный юзер
    }
}
