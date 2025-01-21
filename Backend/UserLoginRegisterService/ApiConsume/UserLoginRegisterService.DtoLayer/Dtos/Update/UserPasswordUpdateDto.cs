using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
	public class UserPasswordUpdateDto
	{
		public int UserID { get; set; }
		public string Password { get; set; }
		public string NewPassword { get; set; }
		public int UpdatedUserID { get; set; }
	}
}
