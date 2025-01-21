using FileImageService.BusinessLayer.Abstract;
using FileImageService.BusinessLayer.Concrete;
using FileImageService.BusinessLayer.Mappings;
using FileImageService.DataAccessLayer.Abstract;
using FileImageService.DataAccessLayer.Concrete;
using FileImageService.DataAccessLayer.EntityFramework;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Context
builder.Services.AddDbContext<Context>();

// Dependency Injection
builder.Services.AddScoped<IImageDal, EfImageDal>();
builder.Services.AddScoped<IImageService, ImageManager>();

// JWT Authentication
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
			IssuerSigningKey = new SymmetricSecurityKey(secretKey)
		};
	});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
	options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// CORS policy
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

// Static file middleware for Images folder

// Use Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
