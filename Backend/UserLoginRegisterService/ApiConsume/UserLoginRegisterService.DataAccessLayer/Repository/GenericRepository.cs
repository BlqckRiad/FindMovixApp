using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.DataAccessLayer.Abstract;
using UserLoginRegisterService.DataAccessLayer.Concrete;

namespace UserLoginRegisterService.DataAccessLayer.Repository
{
	public class GenericRepository<T> : IGenericDal<T> where T : class
	{
		private readonly Context _context;
		public GenericRepository(Context context)
		{
			_context = context;
		}
		public void Add(T entity)
		{
			_context.Add(entity);
			_context.SaveChanges();
		}

		public void Delete(T id)
		{

			_context.Remove(id);
			_context.SaveChanges();

		}

		public T GetByid(int id)
		{

			return _context.Set<T>().Find(id);
		}

		public List<T> GetList()
		{
			return _context.Set<T>().ToList();
		}

		public void Update(T entity)
		{
			_context.Update(entity);
			_context.SaveChanges();
		}


	}
}
