using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileImageService.BusinessLayer.Abstract;
using FileImageService.DtoLayer.Dtos;
using FileImageService.DtoLayer.Dtos.Delete;
using FileImageService.EntityLayer.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileImageService.API.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class ImageController : ControllerBase
	{
        private readonly IImageService _imageService;

        // Cloudinary Configuration
        private readonly Cloudinary _cloudinary;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;

            // Cloudinary yapılandırması
            var account = new Account(
                "dsga1anfp",     // Cloud Name
                "439116693131668", // API Key
                "fs2FsKPIY0oXIa7wtWUzhCLG83A"  // API Secret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpPost]
        public async Task<IActionResult> AddImage(IFormFile file)
        {
            // Dosya geçersizse hata döndür
            if (file == null || file.Length == 0)
            {
                return BadRequest("Geçersiz dosya.");
            }

            // Dosyanın bir resim olup olmadığını kontrol et
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Yalnızca resim dosyaları yüklenebilir.");
            }

            // Cloudinary'e yüklemek için Resmi akışa al
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0; // Akışı baştan oku

                // Cloudinary'e yükleme işlemi
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    PublicId = Guid.NewGuid().ToString()  // Benzersiz bir ID oluştur
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return BadRequest("Resim yüklenirken bir hata oluştu.");
                }

                // Yeni dosya bilgilerini oluştur
                Images newfile = new Images
                {
                    ImageName = uploadResult.PublicId, // Cloudinary'den gelen benzersiz ID
                    CreatedDate = DateTime.Now,
                    ImageUrl = uploadResult.SecureUrl.ToString(), // Cloudinary URL
                    CreatedUserID = 0,
                };

                _imageService.TAdd(newfile);

                int imageId = newfile.ImageID;

                ImageRequestDto request = new ImageRequestDto
                {
                    ImageUrl = uploadResult.SecureUrl.ToString(), // Cloudinary URL
                    ImageName = newfile.ImageName,
                    ImageID = imageId,
                };

                // Başarılı yanıt
                return Ok(request);
            }
        }
        [HttpPost]
		public IActionResult DeleteImage(DeleteDto model)
		{

			var image = _imageService.TGetByid(model.DeletedItemID);
			if(image == null)
			{
				return BadRequest("Image is not found");
			}
			image.IsDeleted = true;
			image.DeletedDate = DateTime.Now;
			image.DeletedUserID = model.DeletedUserID;
			_imageService.TUpdate(image);
			return Ok();
		}
		[HttpGet]
		public IActionResult GetAllImages ()
		{
			var images = _imageService.TGetList().Where(x=> x.IsDeleted ==false );
			return Ok(images);
		}
	}
}
