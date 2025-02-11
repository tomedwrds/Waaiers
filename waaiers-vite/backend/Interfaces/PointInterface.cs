using backend.Models;

namespace backend.Interfaces {
    public interface IPointService
    {
        ProcessedPointData ProcessPoints(List<PostRequestPoints> points, Guid routeID);
        Task<List<WeatherModel>> FetchWeatherAtPoints(List<WeatherModel> weatherPoints, DateTime routeDate);
    }
}

