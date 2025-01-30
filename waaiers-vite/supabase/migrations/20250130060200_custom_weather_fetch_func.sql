CREATE OR REPLACE FUNCTION get_points_weather(route uuid)
RETURNS TABLE (
    latitude float4,
    longitude float4,
    direction float4,
    distance_start float4,
    distance_end float4,
    elevation int4,
    wind_direction float4,
    wind_speed float4,
    wind_speed_gust float4
    )
LANGUAGE plpgsql
AS 
$$
BEGIN
RETURN QUERY
SELECT "Points".latitude, "Points".longitude, "Points".direction, "Points".distance_start, "Points".distance_end, "Points".elevation,   "Weather".wind_direction,"Weather".wind_speed, "Weather".wind_speed_gust
FROM "Points" INNER JOIN "Weather" on "Weather".id = "Points".weather_id
WHERE "Points".route_id = route;
END;
$$;