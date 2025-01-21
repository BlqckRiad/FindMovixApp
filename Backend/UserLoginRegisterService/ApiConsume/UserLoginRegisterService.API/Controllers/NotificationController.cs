using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos.Notif;

namespace UserLoginRegisterService.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public NotificationController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] EmailDto emailDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model uygun değil.");
            }

            try
            {
                await _emailService.SendEmailAsync(emailDto);
                return Ok("Email başarıyla gönderildi.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Email gönderimi başarısız: {ex.Message}");
            }
        }
    }
}
