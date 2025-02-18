using Microsoft.EntityFrameworkCore;
using backend.Models;
using Supabase;
using backend.Interfaces;
using backend.Services;
using DotNetEnv;

DotNetEnv.Env.Load();
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173").AllowAnyHeader();
                          policy.WithOrigins("http://localhost:5173").AllowCredentials();
                      });
});

//Supabase
var options = new SupabaseOptions
      {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
      };
Console.WriteLine(Environment.GetEnvironmentVariable("SUPABASE_URL") + Environment.GetEnvironmentVariable("SUPABASE_KEY"));
builder.Services.AddSingleton(provider => new Supabase.Client(Environment.GetEnvironmentVariable("SUPABASE_URL"), Environment.GetEnvironmentVariable("SUPABASE_KEY"), options));
builder.Services.AddScoped<IPointService, PointService>();
builder.Services.AddScoped<ISegmentService, SegmentService>();

builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

app.Run();
