using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using UserLoginRegisterService.BusinessLayer.Abstract;
using UserLoginRegisterService.BusinessLayer.Concrete;
using UserLoginRegisterService.BusinessLayer.Mappings;
using UserLoginRegisterService.DataAccessLayer.Abstract;
using UserLoginRegisterService.DataAccessLayer.Concrete;
using UserLoginRegisterService.DataAccessLayer.EntityFramework;
using UserLoginRegisterService.DtoLayer.Dtos.Notif;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext configuration
builder.Services.AddDbContext<Context>();

// Add Dependency Injection for services and repositories
builder.Services.AddScoped<IUserDal, EfUserDal>();
builder.Services.AddScoped<IUserService, UserManager>();

// JWT Authentication configuration
var secretKey = Encoding.UTF8.GetBytes("LoginRegisterAPIJWT123LoginRegisterAPIJWT123"); // Replace with your secure key
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = "http://localhost", // Replace with your issuer
			ValidAudience = "http://localhost", // Replace with your audience
			IssuerSigningKey = new SymmetricSecurityKey(secretKey),
			RoleClaimType = ClaimTypes.Role // Ensure Role claims are validated
		};
	});

// Add Authorization policies (if needed)
builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
	options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
});

// Add AutoMapper for DTO and Entity mappings
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add CORS policy to allow requests from any origin
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

builder.Services.Configure<EmailSettingsDto>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

// Use Authentication and Authorization
app.UseAuthentication(); // Ensure this comes before UseAuthorization
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
