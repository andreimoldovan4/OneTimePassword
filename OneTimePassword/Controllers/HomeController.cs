using Microsoft.AspNetCore.Mvc;
using OneTimePassword.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Text;
using System.Security.Cryptography;

namespace OneTimePassword.Controllers
{
    public class HomeController : Controller
    {
        private readonly IMemoryCache _cache;

        public HomeController(IMemoryCache cache)
        {
            _cache = cache;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("/generate-password")]
        public IActionResult GeneratePassword([FromBody] string userId)
        {
            string password = GenerateRandomPassword();
            StorePassword(userId.ToString(), password);
            return Json(new { password });
        }

        [HttpPost]
        [Route("/check-password")]
        public IActionResult CheckPassword([FromBody] PasswordCheckModel data)
        {
            string? userId = data.UserId;
            string? password = data.Password;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(password))
            {
                return Json(false);
            }

            var success = ValidatePassword(userId, password);

            return Json(new { success });
        }

        private string GenerateRandomPassword()
        {
            Random random = new();
            string password = random.Next(100000, 999999).ToString();

            return password;
        }

        private void StorePassword(string userId, string password)
        {
            TimeSpan cacheDuration = TimeSpan.FromSeconds(30);
            _cache.Set(userId, EncodePassword(password), cacheDuration);
        }

        private string EncodePassword(string password)
        {
            using SHA256 sha256 = SHA256.Create();
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = sha256.ComputeHash(passwordBytes);
            string encodedPassword = Convert.ToBase64String(hashBytes);
            return encodedPassword;
        }

        private bool ValidatePassword(string userId, string password)
        {
            var encodedPassword = EncodePassword(password);
            return _cache.TryGetValue(userId, out string cachedOTP) && cachedOTP == encodedPassword;
        }
    }
}