using FileImageService.BusinessLayer.Abstract;
using FileImageService.DataAccessLayer.Abstract;
using FileImageService.EntityLayer.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileImageService.BusinessLayer.Concrete
{
	public class ImageManager:IImageService
	{
		private readonly IImageDal _imageDal;

		public ImageManager(IImageDal imageDal)
		{
			_imageDal = imageDal;
		}
		public void TAdd(Images entity)
		{
			_imageDal.Add(entity);
		}

		public void TDelete(Images id)
		{
			_imageDal.Delete(id);
		}

		public Images TGetByid(int id)
		{
			return _imageDal.GetByid(id);
		}

		public List<Images> TGetList()
		{
			return _imageDal.GetList();
		}

		public void TUpdate(Images entity)
		{
			_imageDal.Update(entity);
		}
	}
}
