using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserLoginRegisterService.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SurName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    UserEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserTelNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserEmailChecked = table.Column<bool>(type: "bit", nullable: false),
                    UserTelNoChecked = table.Column<bool>(type: "bit", nullable: false),
                    UserDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserImageID = table.Column<int>(type: "int", nullable: false),
                    UserImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsUserOnline = table.Column<bool>(type: "bit", nullable: false),
                    UserLoginCount = table.Column<int>(type: "int", nullable: false),
                    UserLastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserLastLogoutDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserSexsID = table.Column<int>(type: "int", nullable: false),
                    UserRoleID = table.Column<int>(type: "int", nullable: false),
                    UserLogoutCount = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserID = table.Column<int>(type: "int", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedUserID = table.Column<int>(type: "int", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedUserID = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
