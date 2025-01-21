using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
	public class UserTelNoUpdatDto
	{
		public int UserID { get; set; }
		public string NewTelNo { get; set; }
		public int UpdatedUserID { get; set; }
	}
}
