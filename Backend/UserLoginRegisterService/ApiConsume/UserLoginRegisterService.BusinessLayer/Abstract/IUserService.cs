using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.BusinessLayer.Abstract
{
	public interface IUserService : IGenericService<User>
	{
		User GetKisiWithTelNo(string telNo);
		User GetKisiWithEmail(string email);
	}
}
