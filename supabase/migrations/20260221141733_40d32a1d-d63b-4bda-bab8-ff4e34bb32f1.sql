
-- Create storage bucket for wish images
INSERT INTO storage.buckets (id, name, public) VALUES ('wish-images', 'wish-images', true);

-- Anyone can upload images
CREATE POLICY "Anyone can upload wish images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wish-images');

-- Anyone can view wish images
CREATE POLICY "Anyone can view wish images" ON storage.objects FOR SELECT USING (bucket_id = 'wish-images');

-- Anyone can delete wish images
CREATE POLICY "Anyone can delete wish images" ON storage.objects FOR DELETE USING (bucket_id = 'wish-images');
