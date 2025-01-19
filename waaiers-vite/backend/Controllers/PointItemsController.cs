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

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RouteItem>> PostRouteItem(PointItems pointItems)
        {
            foreach (var pointItem in pointItems.Points) {
                _context.PointItems.Add(pointItem);
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("AddPointItems", new { pointsAdded = pointItems.Points.Count }, pointItems);
        }
    }
}
