using FileImageService.EntityLayer.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileImageService.DataAccessLayer.Concrete
{
	public class Context : DbContext
	{
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
            optionsBuilder.UseSqlServer("data source=31.186.11.11;initial catalog=FindMovixDb;user id=find105vixcom;password=c5dee-08ea4a;MultipleActiveResultSets=True;App=EntityFramework;TrustServerCertificate=True");
        }
		public DbSet<Images> Images { get; set; }
	}
}
