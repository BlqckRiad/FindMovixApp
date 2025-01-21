using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
    public class UserDeleteDto
    {
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? Password { get; set; }

    }
}
