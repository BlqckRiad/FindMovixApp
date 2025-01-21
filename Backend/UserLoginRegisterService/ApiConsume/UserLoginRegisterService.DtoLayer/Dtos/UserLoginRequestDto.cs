using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos
{
	public class UserLoginRequestDto
	{
		public int UserID { get; set; }
		public string? Name { get; set; }
		public string? SurName { get; set; }
		public string? UserName { get; set; }
		public string? UserEmail { get; set; }	
		public string? UserTelNo { get; set; }
		public string? UserToken {  get; set; }
		public int UserRoleID { get; set; }
		public int UserSexsID { get; set; }
		public int UserImageID { get; set; }
		public string? UserImageUrl { get; set; }

	}
}
