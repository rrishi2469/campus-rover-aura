-- Fix 1: Add CHECK constraint for attendees validation (booking_attendees_validation)
ALTER TABLE public.bookings
ADD CONSTRAINT valid_attendees CHECK (attendees > 0 AND attendees <= 10000);

-- Fix 2: Add admin DELETE policy on bookings (admin_delete_bookings)
CREATE POLICY "Admins can delete any booking" 
ON public.bookings
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 3: Update has_role function to validate caller (has_role_definer_risk)
-- Only allow checking current user's role to prevent arbitrary role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow checking current user's role for security
  IF _user_id != auth.uid() THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;