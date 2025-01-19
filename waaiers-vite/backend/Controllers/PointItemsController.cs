using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointItemsController : ControllerBase
    {
        private readonly backend.Models.PointContext _context;

        public PointItemsController(backend.Models.PointContext context)
        {
            _context = context;
        }

        // GET: api/RouteItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PointItem>>> GetPointItems()
        {
            return await _context.PointItems.ToListAsync();
        }
    }
}
