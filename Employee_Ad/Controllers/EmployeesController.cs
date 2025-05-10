using Employee_Ad.Data;
using Employee_Ad.Models.Entites;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using System.Xml;

namespace Employee_Ad.Controllers
{
    public class EmployeesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        string connectionString;

        public EmployeesController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection");

        }
        public string List()
        {
            DataTable dt = new DataTable();
            APIresopnse aPIresopnse = new APIresopnse();
            string ReturnData = null;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("Sp_GetListData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(dt);
                    }
                }
            }
            var result = new { data = dt };
            string returnData = JsonConvert.SerializeObject(result);
            return returnData;
        }
        public IActionResult MainView()
        {
            return View();
        }

        public string GetEditData(int id)
        {
            DataTable dt = new DataTable();
            APIresopnse aPIresopnse = new APIresopnse();
            string ReturnData = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("Sp_GetEditData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(dt);
                    }
                }
            }
            string returnData = JsonConvert.SerializeObject(dt);
            return returnData;

        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string BindDropDown()
        {
            DataTable dt = new DataTable();
            APIresopnse aPIresopnse = new APIresopnse();
            string ReturnData = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("GetDropDown", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(dt);
                    }
                }
            }
            aPIresopnse.Data = JsonConvert.SerializeObject(dt); ;

            return ReturnData = JsonConvert.SerializeObject(aPIresopnse);
        }

        public string DeleteEmployee(int id)
        {
            DataTable dt = new DataTable();
            APIresopnse aPIresopnse = new APIresopnse();
            string ReturnData = null;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("Sp_DeleteEmployee", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                }

                if (dt.Columns.Contains("ErrorMessage"))
                {
                    aPIresopnse.Message = "Error";
                    aPIresopnse.Data = "Something Want Error";
                }
                else
                {
                    aPIresopnse.Message = "Sucess";
                }
                ReturnData = JsonConvert.SerializeObject(aPIresopnse);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return ReturnData;
        }

        public string SaveEmployee(string jsonString)
        {
            DataTable dt = new DataTable();
            APIresopnse aPIresopnse = new APIresopnse();
            string ReturnData = null;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("Sp_InsertEployee", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@jsonString", jsonString);
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                }

                if (dt.Columns.Contains("ErrorMessage"))
                {
                    aPIresopnse.Message = "Error";
                    aPIresopnse.Data = dt.Rows[0]["ErrorMessage"].ToString();
                }
                else
                {
                    aPIresopnse.Message = "Sucess";
                }
                 ReturnData = JsonConvert.SerializeObject(aPIresopnse);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return ReturnData;
        }
    }
}
