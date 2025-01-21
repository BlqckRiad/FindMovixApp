using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos;
using UserLoginRegisterService.DtoLayer.Dtos.Notif;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.API.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	[AllowAnonymous]
	public class RegisterController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IEmailService _emailService;
        public RegisterController(IUserService userService, IEmailService emailService)
        {
            _userService = userService;
            _emailService = emailService;
        }
		[HttpPost]
		public async Task<IActionResult> UserRegister(UserRegisterDto model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Model Yapıya Uygun Değildir.");
			}

			// Mevcut kullanıcıları getir
			var existingUsers = _userService.TGetList();

			// E-posta ve telefon numarasını kontrol et
			if (existingUsers.Any(u => u.UserEmail == model.UserEmail))
			{
				return BadRequest("E-posta adresi zaten kullanılıyor.");
			}

			if (existingUsers.Any(u => u.UserTelNo == model.UserTelNo))
			{
				return BadRequest("Telefon numarası zaten kullanılıyor.");
			}

			// Yeni kullanıcı oluştur
			var user = new User
			{
				Name = model.Name,
				SurName = model.SurName,
				UserEmail = model.UserEmail,
				UserTelNo = model.UserTelNo,
				UserName = model.UserName,
				CreatedDate = DateTime.Now,
				CreatedUserID = 0,
				UserRoleID = 1 // Rol Entitysinde 1 Değeri Daima Normal User Olarak Atanacaktır.
			};

			// Şifre kontrolü ve hash işlemi
			if (string.IsNullOrEmpty(model.Password))
			{
				return BadRequest("Password is null");
			}

			using (SHA256 sha = SHA256.Create())
			{
				string hashedPassword = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(model.Password)));
				user.Password = hashedPassword;
			}

			// Kullanıcıyı kaydet
			_userService.TAdd(user);

            // Telefon numarasına göre dil seçimi
            bool isTurkishUser = user.UserTelNo?.StartsWith("+90") ?? false;

            // Hoş geldin e-postası gönder
            var welcomeEmailDto = new EmailDto
            {
                ToEmail = user.UserEmail,
                Subject = isTurkishUser ? "FindMovix'e Hoş Geldiniz!" : "Welcome to FindMovix!",
                Body = isTurkishUser ? GetTurkishWelcomeEmail(user) : GetEnglishWelcomeEmail(user)
            };

            try
            {
                await _emailService.SendEmailAsync(welcomeEmailDto);
            }
            catch (Exception ex)
            {
                // E-posta gönderimi başarısız olsa bile kullanıcı kaydı tamamlandı
                // Loglama yapılabilir
                Console.WriteLine($"Hoş geldin e-postası gönderilemedi: {ex.Message}");
            }

			return Ok();
		}

        private string GetTurkishWelcomeEmail(User user)
        {
            return $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                        .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }}
                        .button {{ display: inline-block; padding: 10px 20px; background-color: #E74C3C; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
                        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>FindMovix'e Hoş Geldiniz!</h1>
                        </div>
                        <div class='content'>
                            <h2>Merhaba {user.Name} {user.SurName},</h2>
                            <p>FindMovix ailesine hoş geldiniz! Artık siz de film ve dizi dünyasının kapılarını aralayabilirsiniz.</p>
                            <p>FindMovix ile yapabilecekleriniz:</p>
                            <ul>
                                <li>En yeni film ve dizileri keşfedin</li>
                                <li>Kişiselleştirilmiş öneriler alın</li>
                                <li>Favori içeriklerinizi kaydedin</li>
                                <li>Film ve diziler hakkında yorumlar yapın</li>
                            </ul>
                            <p>Hemen keşfetmeye başlayın!</p>
                            <a href='https://findmovix.com' class='button'>FindMovix'i Keşfet</a>
                            <p>Herhangi bir sorunuz olursa, bizimle iletişime geçmekten çekinmeyin.</p>
                        </div>
                        <div class='footer'>
                            <p>Bu e-posta FindMovix tarafından gönderilmiştir.</p>
                            <p>© 2024 FindMovix. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </body>
                </html>";
        }

        private string GetEnglishWelcomeEmail(User user)
        {
            return $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                        .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }}
                        .button {{ display: inline-block; padding: 10px 20px; background-color: #E74C3C; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
                        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Welcome to FindMovix!</h1>
                        </div>
                        <div class='content'>
                            <h2>Hello {user.Name} {user.SurName},</h2>
                            <p>Welcome to the FindMovix family! You can now explore the world of movies and TV series.</p>
                            <p>What you can do with FindMovix:</p>
                            <ul>
                                <li>Discover the latest movies and TV series</li>
                                <li>Get personalized recommendations</li>
                                <li>Save your favorite content</li>
                                <li>Comment on movies and TV series</li>
                            </ul>
                            <p>Start exploring now!</p>
                            <a href='https://findmovix.com' class='button'>Explore FindMovix</a>
                            <p>If you have any questions, don't hesitate to contact us.</p>
                        </div>
                        <div class='footer'>
                            <p>This email was sent by FindMovix.</p>
                            <p>© 2024 FindMovix. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";
        }
	}
}
