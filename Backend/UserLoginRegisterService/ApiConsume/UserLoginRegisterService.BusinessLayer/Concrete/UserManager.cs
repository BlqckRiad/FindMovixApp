using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DataAccessLayer.Abstract;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.BusinessLayer.Concrete
{
	public class UserManager : IUserService
	{
		private readonly IUserDal _userDal;

		public UserManager(IUserDal userDal)
		{
			_userDal = userDal;
		}
		public void TAdd(User entity)
		{
			_userDal.Add(entity);
		}

		public void TDelete(User id)
		{
			_userDal.Delete(id);
		}

		public User TGetByid(int id)
		{
			return _userDal.GetByid(id);
		}

		public List<User> TGetList()
		{
			return _userDal.GetList();
		}

		public void TUpdate(User entity)
		{
			_userDal.Update(entity);
		}
		public User GetKisiWithTelNo(string telNo)
		{
			return _userDal.GetList().FirstOrDefault(x => x.UserTelNo == telNo);
		}

		public User GetKisiWithEmail(string email)
		{
			return _userDal.GetList().FirstOrDefault(x => x.UserEmail == email);
		}
	}
}
