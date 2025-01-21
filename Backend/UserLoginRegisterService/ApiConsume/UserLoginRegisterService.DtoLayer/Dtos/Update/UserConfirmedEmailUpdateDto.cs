using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
	public class UserConfirmedEmailUpdateDto
	{
        public int UserID { get; set; }
		public bool UserEmailChecked { get; set; }
	}
}
