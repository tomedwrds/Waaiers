using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RouteItemsController : ControllerBase
    {
        private readonly backend.Models.RouteContext _contextRoutes;
        private readonly backend.Models.PointContext _contextPoints;


        public RouteItemsController(backend.Models.RouteContext contextRoutes, backend.Models.PointContext pointContext)
        {
            _contextRoutes = contextRoutes;
            _contextPoints = pointContext;
        }

        // GET: api/RouteItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteItem>>> GetRouteItems()
        {
            return await _contextRoutes.RouteItems.ToListAsync();
        }

        // GET: api/RouteItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RouteItem>> GetRouteItem(Guid id)
        {
            var routeItem = await _contextRoutes.RouteItems.FindAsync(id);

            if (routeItem == null)
            {
                return NotFound();
            }

            return routeItem;
        }

        

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RouteItem>> PostRouteItem(PostRequestRoute request)
        {
            var routeItem = request.Route;
            _contextRoutes.RouteItems.Add(routeItem);
            await _contextRoutes.SaveChangesAsync();
            PointService.ProcessPoints(request.Points, _contextPoints);
            return CreatedAtAction("GetRouteItem", new { id = routeItem.Id }, routeItem);
        }

        // POST: api/RouteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("updatestatus")]
        public async Task<ActionResult<RouteItem>> PostRouteStatusUpdate(RouteStausUpdate routeItem)
        {
            //TODO
            //_context.RouteItems.Add(routeItem);
            //await _context.SaveChangesAsync();

            return CreatedAtAction("GetRouteItem", new { id = routeItem.Id }, routeItem);
        }

        // DELETE: api/RouteItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRouteItem(Guid id)
        {
            var routeItem = await _contextRoutes.RouteItems.FindAsync(id);
            if (routeItem == null)
            {
                return NotFound();
            }

            _contextRoutes.RouteItems.Remove(routeItem);
            await _contextRoutes.SaveChangesAsync();

            return NoContent();
        }

        private bool RouteItemExists(Guid id)
        {
            return _contextRoutes.RouteItems.Any(e => e.Id == id);
        }
    }
}
