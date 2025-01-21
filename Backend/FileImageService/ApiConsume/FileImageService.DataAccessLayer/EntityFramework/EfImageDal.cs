using FileImageService.DataAccessLayer.Abstract;
using FileImageService.DataAccessLayer.Concrete;
using FileImageService.DataAccessLayer.Repository;
using FileImageService.EntityLayer.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileImageService.DataAccessLayer.EntityFramework
{
	public class EfImageDal : GenericRepository<Images>, IImageDal
	{
		public EfImageDal(Context context) : base(context)
		{

		}
	}
}
