using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;
using Supabase;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RouteItemsController : ControllerBase
    {
        private readonly backend.Models.RouteContext _contextRoutes;
        private readonly backend.Models.PointContext _contextPoints;
        private readonly Supabase.Client _supabaseClient;


        public RouteItemsController(backend.Models.RouteContext contextRoutes, backend.Models.PointContext pointContext, Supabase.Client supabaseClient)
        {
            _contextRoutes = contextRoutes;
            _contextPoints = pointContext;
            _supabaseClient = supabaseClient;

        }

        // GET: api/RouteItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteItem>>> GetRouteItems()
        {
            var routes = await _supabaseClient.From<RouteModel>().Get();
            Console.WriteLine(routes.Models);
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
            var model = new RouteModel {
                Name = routeItem.Name,
                Date = routeItem.RaceDateTime,
                Displayed = routeItem.IsDisplayed,
            };
            var response = await _supabaseClient.From<RouteItem>().Insert(model);
            routeItem.Id = response.Model.Id;
            PointService.ProcessPoints(request.Points, _contextPoints, _supabaseClient);
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

            return NoContent();

        }

        // DELETE: api/RouteItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRouteItem(Guid id)
        {
            return NoContent();
        }

        private bool RouteItemExists(Guid id)
        {
            return _contextRoutes.RouteItems.Any(e => e.Id == id);
        }
    }
}
