using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos
{
	public class UserListRequestDto
	{
		public int UserID { get; set; }
		public string? Name { get; set; }
		public string? SurName { get; set; }
		public string? UserName { get; set; }
		public string? UserEmail { get; set; }
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
		public DateTime CreatedDate { get; set; }
		public int CreatedUserID { get; set; }
		public DateTime UpdatedDate { get; set; }
		public int UpdatedUserID { get; set; }
		public DateTime DeletedDate { get; set; }
		public int DeletedUserID { get; set; }
		public bool IsDeleted { get; set; } = false;
	}
}
