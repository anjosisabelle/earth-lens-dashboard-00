-- Drop the existing ineffective policy
DROP POLICY IF EXISTS "Usuario politica" ON public.climacerto;

-- Create proper RLS policies for climacerto table

-- Allow public read access to NASA weather data
CREATE POLICY "Anyone can view climate data"
ON public.climacerto
FOR SELECT
USING (true);

-- Only authenticated users can insert data
CREATE POLICY "Authenticated users can insert climate data"
ON public.climacerto
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update data
CREATE POLICY "Authenticated users can update climate data"
ON public.climacerto
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users can delete data
CREATE POLICY "Authenticated users can delete climate data"
ON public.climacerto
FOR DELETE
TO authenticated
USING (true);