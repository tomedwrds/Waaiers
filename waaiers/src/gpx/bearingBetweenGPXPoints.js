function bearingBetweenGPXPoints(lat1,lat2,lon1,lon2)
{

  const y = Math.sin(lon2-lon1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  const θ = Math.atan2(y, x);
  const brng = (θ*180/Math.PI + 360) % 360; // in degrees

  return brng;


}

export default bearingBetweenGPXPoints;