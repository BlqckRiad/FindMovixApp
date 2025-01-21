using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.DtoLayer.Dtos.Notif;

namespace UserLoginRegisterService.BusinessLayer.Concrete
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettingsDto _emailSettings;

        public EmailService(IOptions<EmailSettingsDto> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(EmailDto emailDto)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("FindMovix", _emailSettings.Mail));
            email.To.Add(new MailboxAddress("User", emailDto.ToEmail));
            email.Subject = emailDto.Subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = emailDto.Body;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_emailSettings.Mail, _emailSettings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
