-- Drop the unused daily_weather_summary view
-- This view is not used in the application and is causing security warnings
-- If aggregated weather data is needed in the future, it can be queried
-- directly from the climacerto table with proper RLS enforcement

DROP VIEW IF EXISTS public.daily_weather_summary;