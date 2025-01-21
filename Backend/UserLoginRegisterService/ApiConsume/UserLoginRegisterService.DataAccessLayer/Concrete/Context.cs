using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.DataAccessLayer.Concrete
{
	public class Context : DbContext
	{
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("data source=31.186.11.11;initial catalog=FindMovixDb;user id=find105vixcom;password=c5dee-08ea4a;MultipleActiveResultSets=True;App=EntityFramework;TrustServerCertificate=True");
        }
        public DbSet<User> Users { get; set; }
	}
}
