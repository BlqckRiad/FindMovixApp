using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Update
{
    public class UserUpdateDto
    {
        public int UserID { get; set; }
        public string? Name { get; set; }
        public string? SurName { get; set; }
        public string? UserName { get; set; }
        public DateTime UserDate { get; set; } = DateTime.MinValue;
        public int UserSexsID { get; set; }
        public int UpdatedUserID { get; set; }
    }
}
