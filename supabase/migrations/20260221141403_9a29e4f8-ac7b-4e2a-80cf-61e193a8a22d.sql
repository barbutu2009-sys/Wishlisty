
-- Create wishes table
CREATE TABLE public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  url TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Random',
  priority SMALLINT NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Anyone can view wishes (so boyfriend can see them)
CREATE POLICY "Anyone can view wishes" ON public.wishes FOR SELECT USING (true);

-- Anyone can insert wishes (so girlfriend can add them)
CREATE POLICY "Anyone can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);

-- Anyone can delete wishes
CREATE POLICY "Anyone can delete wishes" ON public.wishes FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
