using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos.Update;

namespace UserLoginRegisterService.API.Controllers
{
    [Route("api/[controller]/[action]")]
	[ApiController]
	
	public class UserUpdateController : ControllerBase
	{
		private readonly IUserService _userService;
        public UserUpdateController(IUserService userService)
        {
            _userService = userService;
        }
		[HttpPost]
		public ActionResult UserUpdate(UserUpdateDto model)
		{
			if(!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if(user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UpdatedDate = DateTime.Now;
			user.UpdatedUserID = model.UpdatedUserID;
			user.Name = model.Name;
			user.SurName = model.SurName;
			user.UserName = model.UserName;
			user.UserDate = model.UserDate;
			user.UserSexsID = model.UserSexsID;
			_userService.TUpdate(user);
			return Ok(model);
		}
		[HttpPost]
		public IActionResult UserEmailUpdate(UserEmailUpdateDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UserEmail = model.NewEmail;
			user.UserEmailChecked = true; // Burada user email güncellerken yeni emailine kod göndericez o kodu doğru girdiğini düşünüyoruz. O yüzden emaili aynı zamanda confirm ettik.
			user.UpdatedDate = DateTime.Now;
			user.UpdatedUserID = model.UpdatedUserID;
			_userService.TUpdate(user);
			return Ok(model);
		}
		[HttpPost]
		public IActionResult UserTelNoUpdate(UserTelNoUpdatDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UserTelNo = model.NewTelNo;
			user.UserTelNoChecked = true; // Burada user telNo güncellerken yeni telefon numarasına kod göndericez o kodu doğru girdiğini düşünüyoruz. O yüzden telno aynı zamanda confirm ettik.
			user.UpdatedDate = DateTime.Now;
			user.UpdatedUserID = model.UpdatedUserID;
			_userService.TUpdate(user);

			return Ok(model);
		}
		[HttpPost]
		public IActionResult UserImageUpdate(UserImageUpdateDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UserImageID = model.NewImageID;
			user.UserImageUrl = model.NewImageUrl;
			user.UpdatedDate = DateTime.Now;
			user.UpdatedUserID = model.UpdatedUserID;
			_userService.TUpdate(user);
			return Ok(model);
		}
		[HttpPost]
		public IActionResult UserPasswordUpdate(UserPasswordUpdateDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			var oldpas = model.Password;
			var newpass = model.NewPassword;

			using (SHA256 sha = SHA256.Create())
			{
				string hashedPassword = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(oldpas)));
				if (user.Password != hashedPassword)
				{
					return BadRequest("Şifre hatalı.");
				}
				else
				{
					string hashednewpass = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(newpass)));
					user.Password = hashednewpass;
					user.UpdatedDate= DateTime.Now;
					user.UpdatedUserID = model.UpdatedUserID;
					_userService.TUpdate(user);
					return Ok();
				}
			}
		}
		[HttpPost]
		public IActionResult UserConfirmedEmailUpdate(UserConfirmedEmailUpdateDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UserEmailChecked = model.UserEmailChecked;
			user.UpdatedDate = DateTime.Now;
			_userService.TUpdate(user);
			return Ok();
		}
		[HttpPost]
		public IActionResult UserConfirmedTelNoUpdate(UserConfirmedTelNoUpdateDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Uygun Değildir.");
			}
			var user = _userService.TGetByid(model.UserID);
			if (user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı.");
			}
			user.UserTelNoChecked = model.UserTelNoChecked;
			user.UpdatedDate = DateTime.Now;
			_userService.TUpdate(user);
			return Ok();
		}

		[HttpPost]
		public IActionResult DeleteUser(UserDeleteDto model)
		{
			var user = _userService.GetKisiWithEmail(model.UserEmail);
			if(user == null)
			{
				return BadRequest("User Bulunamadı");
			}
			var pass = model.Password;

            using (SHA256 sha = SHA256.Create())
            {
                string hashedPassword = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(pass)));
                if (user.Password != hashedPassword)
                {
                    return BadRequest("Şifre hatalı.");
				}
				else
				{
					_userService.TDelete(user);
					return Ok();
				}
               
            }

		}
	}
}
