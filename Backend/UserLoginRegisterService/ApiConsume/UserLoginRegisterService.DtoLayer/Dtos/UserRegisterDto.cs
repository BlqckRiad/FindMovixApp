using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos
{
	public class UserRegisterDto
	{
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
	}
}
