using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserLoginRegisterService.DtoLayer.Dtos.Notif
{
    public class EmailSettingsDto
    {
        public string Mail { get; set; } = "findmovix@gmail.com";
        public string Password { get; set; } = "qsph ldba qsrs tthq";
        public string Host { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 587;
    }
}
