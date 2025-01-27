using backend.Models;

namespace backend.Interfaces {
    public interface IPointService
    {
        Task<float> ProcessPoints(List<PostRequestPoints> points, DateTime routeData, Guid routeID);
        float DistanceBetweenPoints(float lat1, float lat2, float lon1, float lon2);
        float BearingBetweenPoints(float lat1, float lat2, float lon1, float lon2);
    }
}

