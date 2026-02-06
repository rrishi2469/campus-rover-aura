import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Booking {
  id: string;
  user_id: string;
  classroom_id: string;
  classroom_name: string;
  building: string;
  day: string;
  time: string;
  booking_type: string;
  attendees: number;
  status: string;
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_role?: string;
}

export interface Classroom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  amenities: string[];
}

export function useBookings(user: User | null) {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserBookings([]);
      setApprovedBookings([]);
      setLoading(false);
      return;
    }

    fetchAllBookings();

    // Set up real-time subscription for all booking changes
    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change:', payload);
          fetchAllBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchAllBookings = async () => {
    if (!user) return;
    
    try {
      // Fetch user's own bookings
      const { data: userBookingsData, error: userError } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (userError) throw userError;
      setUserBookings(userBookingsData || []);

      // Fetch all approved bookings for the calendar
      const { data: approvedData, error: approvedError } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (approvedError) throw approvedError;
      setApprovedBookings(approvedData || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    userBookings, 
    approvedBookings, 
    loading, 
    refetch: fetchAllBookings 
  };
}

export function useClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const { data, error } = await supabase
        .from("classrooms")
        .select("*")
        .order("building", { ascending: true });

      if (error) throw error;
      setClassrooms(data || []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group classrooms by building
  const classroomsByBuilding = classrooms.reduce((acc, classroom) => {
    const building = classroom.building.replace("Building ", "");
    if (!acc[building]) {
      acc[building] = [];
    }
    acc[building].push(classroom);
    return acc;
  }, {} as Record<string, Classroom[]>);

  return { classrooms, classroomsByBuilding, loading, refetch: fetchClassrooms };
}

export async function createBooking(
  userId: string,
  classroomId: string,
  classroomName: string,
  building: string,
  day: string,
  time: string,
  bookingType: string,
  attendees: number
) {
  // Server-side validation for attendees
  if (!Number.isInteger(attendees) || attendees < 1 || attendees > 10000) {
    throw new Error('Attendees must be between 1 and 10000');
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      classroom_id: classroomId,
      classroom_name: classroomName,
      building: building,
      day: day,
      time: time,
      booking_type: bookingType,
      attendees: attendees,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
