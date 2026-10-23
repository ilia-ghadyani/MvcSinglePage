using Microsoft.EntityFrameworkCore;
using MvcSinglePage.Models.DomainModels.PersonAggregates;

namespace MvcSinglePage.Models
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options)
        {
            
        }
        public DbSet<Person> Person { get; set; }
    }
}
