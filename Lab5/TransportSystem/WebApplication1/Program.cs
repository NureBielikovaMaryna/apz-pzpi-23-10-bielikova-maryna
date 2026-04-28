using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;   
using WebApplication1.Models;

var builder = WebApplication.CreateBuilder(args);

// Изменяем здесь:
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // ListenAnyIP(5152) открывает сервер для внешних подключений (через туннель)
    serverOptions.ListenAnyIP(5152);
});

// бд +
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=transport.db"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// авто 
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); 
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
     .AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader());

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();