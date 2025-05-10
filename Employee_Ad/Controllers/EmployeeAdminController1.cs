using Employee_Ad.Data;
using Employee_Ad.Models.Entites;
using Microsoft.AspNetCore.Mvc;

namespace Employee_Ad.Controllers
{
    public class EmployeeAdminController1 : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        public EmployeeAdminController1(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }
    
    }
}
