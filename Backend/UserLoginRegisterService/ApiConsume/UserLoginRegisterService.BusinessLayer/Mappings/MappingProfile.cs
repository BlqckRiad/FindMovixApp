using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.DtoLayer.Dtos;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.BusinessLayer.Mappings
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// User -> UserListRequestDto eşleme
			CreateMap<User, UserListRequestDto>();
		}
	}
}
