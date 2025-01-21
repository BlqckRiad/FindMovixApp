using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.EntityLayer.Concrete
{
	public class BaseEntity
	{
		public DateTime CreatedDate { get; set; }
		public int CreatedUserID { get; set; }
		public DateTime UpdatedDate { get; set; }
		public int UpdatedUserID { get; set; }
		public DateTime DeletedDate { get; set; }
		public int DeletedUserID { get; set; }
		public bool IsDeleted { get; set; } = false;
	}

}
