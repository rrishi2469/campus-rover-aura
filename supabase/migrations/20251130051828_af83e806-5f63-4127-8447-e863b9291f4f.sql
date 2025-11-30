-- Create classrooms table
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on classrooms
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Everyone can view classrooms (public data)
CREATE POLICY "Anyone can view classrooms" ON public.classrooms
FOR SELECT USING (true);

-- Only admins can manage classrooms
CREATE POLICY "Admins can insert classrooms" ON public.classrooms
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update classrooms" ON public.classrooms
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete classrooms" ON public.classrooms
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  classroom_name TEXT NOT NULL,
  building TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  booking_type TEXT NOT NULL,
  attendees INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" ON public.bookings
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update any booking (for approval/rejection)
CREATE POLICY "Admins can update bookings" ON public.bookings
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Users can delete their own pending bookings
CREATE POLICY "Users can delete their own pending bookings" ON public.bookings
FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- Triggers for updated_at
CREATE TRIGGER update_classrooms_updated_at
BEFORE UPDATE ON public.classrooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Insert default classrooms
-- Building A (5 classrooms)
INSERT INTO public.classrooms (name, building, capacity, amenities) VALUES
('A101', 'Building A', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('A102', 'Building A', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('A103', 'Building A', 35, ARRAY['Projector', 'Whiteboard']),
('A104', 'Building A', 35, ARRAY['Projector', 'Whiteboard']),
('A105', 'Building A', 30, ARRAY['Whiteboard', 'AC']);

-- Building B (5 classrooms)
INSERT INTO public.classrooms (name, building, capacity, amenities) VALUES
('B101', 'Building B', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('B102', 'Building B', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('B103', 'Building B', 35, ARRAY['Projector', 'Whiteboard']),
('B104', 'Building B', 35, ARRAY['Projector', 'Whiteboard']),
('B105', 'Building B', 30, ARRAY['Whiteboard', 'AC']);

-- Building C (5 classrooms)
INSERT INTO public.classrooms (name, building, capacity, amenities) VALUES
('C101', 'Building C', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('C102', 'Building C', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('C103', 'Building C', 35, ARRAY['Projector', 'Whiteboard']),
('C104', 'Building C', 35, ARRAY['Projector', 'Whiteboard']),
('C105', 'Building C', 30, ARRAY['Whiteboard', 'AC']);

-- Building D (5 classrooms)
INSERT INTO public.classrooms (name, building, capacity, amenities) VALUES
('D101', 'Building D', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('D102', 'Building D', 40, ARRAY['Projector', 'Whiteboard', 'AC']),
('D103', 'Building D', 35, ARRAY['Projector', 'Whiteboard']),
('D104', 'Building D', 35, ARRAY['Projector', 'Whiteboard']),
('D105', 'Building D', 30, ARRAY['Whiteboard', 'AC']);

-- Auditorium (5 spaces)
INSERT INTO public.classrooms (name, building, capacity, amenities) VALUES
('Main Auditorium', 'Auditorium', 500, ARRAY['Projector', 'Sound System', 'AC', 'Stage']),
('Mini Auditorium', 'Auditorium', 150, ARRAY['Projector', 'Sound System', 'AC']),
('Seminar Hall 1', 'Auditorium', 100, ARRAY['Projector', 'Sound System', 'AC']),
('Seminar Hall 2', 'Auditorium', 100, ARRAY['Projector', 'Sound System', 'AC']),
('Conference Room', 'Auditorium', 30, ARRAY['Projector', 'Whiteboard', 'AC', 'Video Conferencing']);