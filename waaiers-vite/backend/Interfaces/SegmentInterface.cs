using backend.Models;

namespace backend.Interfaces {
    public interface ISegmentService
    {
        public List<ReturnedSegment> GenerateSegments(List<SegmentPointsRPCResponse> weatherPoints);
    }
}

