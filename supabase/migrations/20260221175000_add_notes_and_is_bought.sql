-- Add notes and is_bought columns to wishes table
ALTER TABLE public.wishes ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.wishes ADD COLUMN IF NOT EXISTS is_bought boolean NOT NULL DEFAULT false;
