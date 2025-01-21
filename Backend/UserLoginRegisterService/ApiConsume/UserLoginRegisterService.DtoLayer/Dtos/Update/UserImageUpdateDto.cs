using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
	public class UserImageUpdateDto
	{
        public int UserID { get; set; }
        public int NewImageID { get; set; }
		
		public string NewImageUrl { get; set; }
		public int UpdatedUserID { get; set; }

	}
}
