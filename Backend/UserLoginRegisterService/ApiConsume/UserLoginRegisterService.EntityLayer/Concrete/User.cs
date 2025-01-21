using System.ComponentModel.DataAnnotations;

namespace UserLoginRegisterService.EntityLayer.Concrete
{

	public class User : BaseEntity
	{
		[Key]
		public int UserID { get; set; }

		[Required(ErrorMessage = "Name alanı zorunludur.")]
		[StringLength(50, ErrorMessage = "KisiAdi en fazla 50 karakter olabilir.")]
		public string? Name { get; set; }

		[Required(ErrorMessage = "SurName alanı zorunludur.")]
		[StringLength(50, ErrorMessage = "KisiSoyAdi en fazla 50 karakter olabilir.")]
		public string? SurName { get; set; }

		[Required(ErrorMessage = "UserName alanı zorunludur.")]
		[StringLength(40, ErrorMessage = "KisiKullaniciAdi en fazla 40 karakter olabilir.")]
		public string? UserName { get; set; }

		[Required(ErrorMessage = "UserEmail alanı zorunludur.")]
		[EmailAddress(ErrorMessage = "Geçersiz e-posta formatı.")]
		public string? UserEmail { get; set; }

		[Required(ErrorMessage = "Password alanı zorunludur.")]
		[StringLength(100, MinimumLength = 6, ErrorMessage = "KisiPassword en az 6 ve en fazla 100 karakter olmalıdır.")]
		public string? Password { get; set; }
		public string? UserTelNo { get; set; }
		public bool UserEmailChecked { get; set; } = false;
		public bool UserTelNoChecked { get; set; } = false;
		public DateTime UserDate { get; set; } = DateTime.MinValue;
		public int UserImageID { get; set; }
		public string? UserImageUrl { get; set; }
		public bool IsUserOnline { get; set; }
		public int UserLoginCount { get; set; }
		public DateTime UserLastLoginDate { get; set; } = DateTime.MinValue;
		public DateTime UserLastLogoutDate { get; set; } = DateTime.MinValue;
		public int UserSexsID { get; set; }
		public int UserRoleID { get; set; }
		
		public int UserLogoutCount { get; set; }
		
	}
}

