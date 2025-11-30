import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingDialog } from "@/components/BookingDialog";
import { supabase } from "@/integrations/supabase/client";
import { useBookings } from "@/hooks/useBookings";
import type { User, Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string>("Guest");

  const { bookings, loading: bookingsLoading } = useBookings(user);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Sanitize username to prevent XSS
        const sanitizedUsername = data.username.replace(/[<>]/g, '');
        setUsername(sanitizedUsername);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  // Convert database bookings to slot format
  const approvedBookings = bookings.filter(b => b.status === "approved");
  
  const getBookingColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-primary/20 border-primary/40 text-primary";
      case "club":
        return "bg-secondary/20 border-secondary/40 text-secondary";
      case "event":
        return "bg-accent/20 border-accent/40 text-accent";
      default:
        return "bg-muted";
    }
  };

  const getBookedSlot = (dayName: string, time: string) => {
    return approvedBookings.find(booking => 
      booking.day === dayName && booking.time === time
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aura glow effects */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{
        animationDelay: "1s"
      }}></div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Hi, <span className="text-[#272727]">{username}</span>!
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome to your CampusRover dashboard
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="gradient-card text-white hover:opacity-90 transition-opacity glow-blue font-semibold"
            onClick={() => setBookingDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Book Your Classroom
          </Button>
        </div>

        {/* Weekly Calendar */}
        <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{
          animationDelay: "0.1s"
        }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Schedule</h2>
          
          {bookingsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading schedule...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Days Header */}
                <div className="grid grid-cols-6 gap-4 mb-4">
                  <div className="text-sm font-semibold text-muted-foreground"></div>
                  {days.map(day => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-bold text-foreground">{day}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-2">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-6 gap-4">
                      <div className="text-sm font-medium text-muted-foreground py-3 font-helvetica">
                        {time}
                      </div>
                      {days.map((day) => {
                        const bookedSlot = getBookedSlot(day, time);
                        return (
                          <div 
                            key={`${day}-${time}`} 
                            className={`
                              rounded-lg border-2 p-3 min-h-[60px] transition-all
                              ${bookedSlot 
                                ? `${getBookingColor(bookedSlot.booking_type)} border-2` 
                                : "border-border/50 hover:border-primary/30 hover:bg-muted/30 cursor-pointer"
                              }
                            `}
                          >
                            {bookedSlot && (
                              <div className="text-sm font-semibold font-helvetica">
                                {bookedSlot.classroom_name}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-6 mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary/40"></div>
              <span className="text-sm text-muted-foreground">Lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary/20 border-2 border-secondary/40"></div>
              <span className="text-sm text-muted-foreground">Club Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent/20 border-2 border-accent/40"></div>
              <span className="text-sm text-muted-foreground">Event</span>
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        {bookings.length > 0 && (
          <div className="glass-card rounded-2xl p-8 mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold text-foreground mb-6">My Booking Requests</h2>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'approved' ? 'bg-emerald-500' : 
                      booking.status === 'declined' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-foreground">{booking.classroom_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.building}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{booking.day} at {booking.time}</p>
                    <p className="text-sm text-muted-foreground capitalize">{booking.booking_type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    booking.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <BookingDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      </div>
    </div>
  );
};
export default Dashboard;
