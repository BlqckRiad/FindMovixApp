using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.DataAccessLayer.Abstract
{
	
	public interface IUserDal : IGenericDal<User>
	{
	}
}
