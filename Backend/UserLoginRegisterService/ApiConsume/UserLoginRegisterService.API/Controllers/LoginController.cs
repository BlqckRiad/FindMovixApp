using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.API.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	[AllowAnonymous]
	public class LoginController : ControllerBase
	{
		private readonly IUserService _userService;
        public LoginController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost]
		public IActionResult UserLogin(UserLoginDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Yapıya Uygun Değildir");
			}

			if (string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.EmailOrTelNo))
			{
				return BadRequest("Giriş Yapılırken Alanlar Boş Olamaz");
			}

			var pass = model.Password;
			var emortel = model.EmailOrTelNo;

			// E-posta kontrolü
			bool isEmail = emortel.Contains('@') && emortel.Contains('.');

			User user;
			if (isEmail)
			{
				// Email ile kullanıcıyı bul
				user = _userService.TGetList().FirstOrDefault(u => u.UserEmail == emortel);
			}
			else
			{
				user = _userService.TGetList().FirstOrDefault(u => u.UserTelNo == emortel);
			}

			if (user == null)
			{
				return BadRequest("Kullanıcı bulunamadı.");
			}
			if(user.IsDeleted == true)
			{
				return BadRequest("Kullanıcı Silinmiş.");
			}

			// Şifre doğrulama
			using (SHA256 sha = SHA256.Create())
			{
				string hashedPassword = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(pass)));
				if (user.Password != hashedPassword)
				{
					return BadRequest("Şifre hatalı.");
				}
			}
			string token = GenerateJwtToken(user);

			var userrequest = new UserLoginRequestDto();
			userrequest.Name = user.Name;
			userrequest.UserEmail = user.UserEmail;
			userrequest.SurName = user.SurName;
			userrequest.UserTelNo = user.UserTelNo;
			userrequest.UserRoleID = user.UserRoleID;
			userrequest.UserImageID = user.UserImageID;
			userrequest.UserName = user.UserName;
			userrequest.UserImageUrl = user.UserImageUrl;
			userrequest.UserSexsID = user.UserSexsID;
			userrequest.UserID = user.UserID;
			userrequest.UserToken = token;

			return Ok(userrequest);
		}

		private string GenerateJwtToken(User user)
		{
			// Secret key and configuration must match Program.cs
			var secretKey = Encoding.UTF8.GetBytes("LoginRegisterAPIJWT123LoginRegisterAPIJWT123"); // Aynı key olmalı
			var issuer = "http://localhost"; // Aynı issuer olmalı
			var audience = "http://localhost"; // Aynı audience olmalı

			// Create signing credentials
			var securityKey = new SymmetricSecurityKey(secretKey);
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			// Role mapping
			string roleName = user.UserRoleID switch
			{
				1 => "User",
				2 => "Admin",
				_ => "Unknown"
			};

			// Create claims
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token identifier
				new Claim("UserID", user.UserID.ToString()),
				new Claim("RoleID", user.UserRoleID.ToString()),
				new Claim(ClaimTypes.Role, roleName)
			};

			// Create the token
			var token = new JwtSecurityToken(
				issuer: issuer,
				audience: audience,
				claims: claims,
				expires: DateTime.UtcNow.AddMonths(3), // Token expiration (3 months)
				signingCredentials: credentials
			);

			// Return the token as a string
			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
