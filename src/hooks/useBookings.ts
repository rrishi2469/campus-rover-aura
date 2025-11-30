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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetchBookings();

    // Set up real-time subscription
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change:', payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, refetch: fetchBookings };
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
