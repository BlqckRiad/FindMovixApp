using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileImageService.EntityLayer.Concrete
{
	public class Images : BaseEntity
	{
		[Key]
		public int ImageID { get; set; }
		[Required(ErrorMessage = "ImageName Degeri Bos Bırakılamaz.")]
		public string? ImageName { get; set; }
		[Required(ErrorMessage = "ImageUrl Degeri Bos Bırakılamaz.")]
		public string? ImageUrl { get; set; }
	}
}
