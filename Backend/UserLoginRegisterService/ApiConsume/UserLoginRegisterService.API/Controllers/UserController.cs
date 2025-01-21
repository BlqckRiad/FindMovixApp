using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos;
using UserLoginRegisterService.EntityLayer.Concrete;

namespace UserLoginRegisterService.API.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	
	
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IMapper _mapper;
        public UserController(IUserService userService , IMapper mapper)
        {
            _userService = userService;
			_mapper = mapper;
        }
		[HttpGet]
		public IActionResult GetAllUsers()
		{
			var users = _userService.TGetList().Where(x=> x.IsDeleted == false);
			var userDtos = _mapper.Map<List<UserListRequestDto>>(users);

			return Ok(userDtos);
		}
		[HttpGet]
		public IActionResult GetDeletedUsers()
		{
			var users = _userService.TGetList().Where(x => x.IsDeleted == true);
			var userDtos = _mapper.Map<List<UserListRequestDto>>(users);

			return Ok(userDtos);
		}
		[HttpGet]
		public IActionResult GetKisiWithID(int id)
		{
			var user = _userService.TGetByid(id);

			if (user == null)
			{
				return NotFound("Kullanıcı bulunamadı.");
			}

			var userDto = _mapper.Map<UserListRequestDto>(user);
			return Ok(userDto);
		}

		[HttpGet]
        public IActionResult GetKisiWithEmail(string email)
        {
            var user = _userService.GetKisiWithEmail(email);
			if (user == null)
			{
				return NotFound("Kullanıcı bulunamadı.");
			}

			var userDto = _mapper.Map<UserListRequestDto>(user);
			return Ok(userDto);
		}

        [HttpGet]
        public IActionResult GetKisiWithTelNo(string telNo)
        {
            var user = _userService.GetKisiWithTelNo(telNo);
			if (user == null)
			{
				return NotFound("Kullanıcı bulunamadı.");
			}

			var userDto = _mapper.Map<UserListRequestDto>(user);
			return Ok(userDto);
		}
	}
}
