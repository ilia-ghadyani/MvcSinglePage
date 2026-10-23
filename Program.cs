using Microsoft.EntityFrameworkCore;
using MvcSinglePage.ApplicationServices;
using MvcSinglePage.ApplicationServices.Contracts;
using MvcSinglePage.Models;
using MvcSinglePage.Models.Services.Contracts;
using MvcSinglePage.Models.Services.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure the connection string
var connectionString = builder.Configuration
    .GetConnectionString("ProjectDbContext")
    ?? throw new InvalidOperationException
    ("Connection string 'ProjectDbContext' not found.");

// Register ProjectDbContext in the dependency injection container
builder.Services.AddDbContext<ProjectDbContext>(options => options.UseSqlServer(connectionString));

// Register PersonRepository for dependency injection
builder.Services.AddScoped<IPersonRepository, PersonRepository>();

// Register PersonApplicationService for dependency injection
builder.Services.AddScoped<IPersonApplicationService, PersonApplicationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days.
    // You may want to change this for production scenarios,
    // see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
