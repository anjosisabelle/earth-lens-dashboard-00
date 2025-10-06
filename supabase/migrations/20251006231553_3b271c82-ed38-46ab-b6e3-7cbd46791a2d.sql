-- Drop the existing view that uses SECURITY DEFINER (default)
DROP VIEW IF EXISTS public.daily_weather_summary;

-- Recreate the view with SECURITY INVOKER to respect RLS policies
CREATE VIEW public.daily_weather_summary
WITH (security_invoker=on)
AS
SELECT 
  date(ts) AS date,
  lat,
  lon,
  avg(temp_c) AS avg_temp_c,
  avg(humidity_pct) AS avg_humidity_pct,
  sum(precip_mm) AS total_precip_mm
FROM public.climacerto
GROUP BY date(ts), lat, lon;