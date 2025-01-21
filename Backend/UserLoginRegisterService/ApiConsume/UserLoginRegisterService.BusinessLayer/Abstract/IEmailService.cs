using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserLoginRegisterService.DtoLayer.Dtos.Notif;

namespace UserLoginRegisterService.BusinessLayer.Abstract
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailDto emailDto);
    }
}
