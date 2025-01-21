using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.BusinessLayer.Abstract
{
	public interface IGenericService<T> where T : class
	{
		void TAdd(T entity);
		void TDelete(T t);
		void TUpdate(T entity);
		List<T> TGetList();

		T TGetByid(int id);
	}
}
