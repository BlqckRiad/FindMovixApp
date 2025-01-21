using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DataAccessLayer.Abstract
{
	public interface IGenericDal<T> where T : class
	{
		void Add(T entity);
		void Delete(T t);
		void Update(T entity);
		List<T> GetList();

		T GetByid(int id);


	}
}
