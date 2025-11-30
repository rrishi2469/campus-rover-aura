import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Building2, 
  Check, 
  X,
  LayoutDashboard,
  Calendar,
  Settings,
  HelpCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import AddClassroomModal from "@/components/AddClassroomModal";
import { useClassrooms, updateBookingStatus, type Booking } from "@/hooks/useBookings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [addClassroomOpen, setAddClassroomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"requests" | "classrooms" | "calendar">("requests");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const { classrooms, loading: classroomsLoading } = useClassrooms();

  // Fetch all bookings for admin
  const fetchAllBookings = async () => {
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
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Verify admin role and fetch bookings
  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (!userRoles || userRoles.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate("/dashboard");
        } else {
          fetchAllBookings();
        }
      }
    };

    verifyAdmin();
  }, [user, navigate]);

  // Set up real-time subscription for bookings
  useEffect(() => {
    const channel = supabase
      .channel('admin-bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchAllBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await updateBookingStatus(id, "approved");
      toast({
        title: "Request Approved",
        description: "Booking request has been approved successfully",
      });
    } catch (error) {
      console.error("Error approving booking:", error);
      toast({
        title: "Error",
        description: "Failed to approve booking",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      await updateBookingStatus(id, "declined");
      toast({
        title: "Request Declined",
        description: "Booking request has been declined",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error declining booking:", error);
      toast({
        title: "Error",
        description: "Failed to decline booking",
        variant: "destructive",
      });
    }
  };

  const handleAddClassroom = async (classroom: { name: string; building: string; capacity: number; amenities: string[] }) => {
    try {
      const { error } = await supabase
        .from("classrooms")
        .insert({
          name: classroom.name,
          building: classroom.building,
          capacity: classroom.capacity,
          amenities: classroom.amenities,
        });

      if (error) throw error;

      toast({
        title: "Classroom Added",
        description: `${classroom.name} has been added successfully`,
      });
    } catch (error) {
      console.error("Error adding classroom:", error);
      toast({
        title: "Error",
        description: "Failed to add classroom",
        variant: "destructive",
      });
    }
  };

  const pendingRequests = bookings.filter(b => b.status === "pending");
  const approvedBookings = bookings.filter(b => b.status === "approved");
  const approvedToday = approvedBookings.length;

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "requests" as const },
    { icon: Calendar, label: "Calendar", tab: "calendar" as const },
    { icon: Building2, label: "Classrooms", tab: "classrooms" as const },
    { icon: Settings, label: "Settings", tab: null },
    { icon: HelpCircle, label: "Help", tab: null },
  ];

  // Calendar view helpers
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <span className="text-xl font-bold text-foreground">CampusRover</span>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => item.tab && setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.tab === activeTab 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between lg:justify-end">
          <span className="text-xl font-bold text-foreground lg:hidden">CampusRover</span>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAddClassroomOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Classroom
            </Button>
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Hi, Admin!
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending Requests</p>
              <p className="text-3xl font-bold text-foreground">{pendingRequests.length}</p>
              <div className="mt-4 space-y-2">
                {pendingRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{req.classroom_name}</span>
                    <span className="text-amber-600 font-medium ml-2">Pending</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Classrooms</p>
              <p className="text-3xl font-bold text-foreground">{classrooms.length}</p>
              <div className="mt-4 space-y-2">
                {classrooms.slice(0, 2).map((room) => (
                  <div key={room.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{room.name} - {room.building}</span>
                    <span className="text-primary font-medium ml-2">{room.capacity} seats</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Approved Bookings</p>
              <p className="text-3xl font-bold text-foreground">{approvedToday}</p>
              <div className="mt-4 space-y-2">
                {approvedBookings.slice(0, 2).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{booking.classroom_name}</span>
                    <span className="text-emerald-600 font-medium ml-2">Approved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "requests"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "calendar"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Weekly Calendar
            </button>
            <button
              onClick={() => setActiveTab("classrooms")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "classrooms"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" />
              All Classrooms
            </button>
          </div>

          {/* Content Area */}
          {activeTab === "requests" && (
            <div className="space-y-3">
              {bookingsLoading ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">Loading requests...</p>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending requests at the moment</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                          Classroom
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">
                          Day & Time
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                          Type
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden xl:table-cell">
                          Attendees
                        </th>
                        <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pendingRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{request.classroom_name}</p>
                              <p className="text-sm text-muted-foreground">{request.building}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div>
                              <p className="font-medium text-foreground">{request.day}</p>
                              <p className="text-sm text-muted-foreground">{request.time}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-foreground capitalize">{request.booking_type}</p>
                          </td>
                          <td className="px-6 py-4 hidden xl:table-cell">
                            <p className="text-foreground">{request.attendees}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleAcceptRequest(request.id)}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeclineRequest(request.id)}
                                size="sm"
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Schedule - Approved Bookings</h3>
              
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
                                  : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
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
          )}

          {activeTab === "classrooms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {classroomsLoading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Loading classrooms...
                </div>
              ) : (
                classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{classroom.name}</h3>
                        <p className="text-sm text-muted-foreground">{classroom.building}</p>
                      </div>
                      <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                        {classroom.capacity} seats
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {classroom.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <AddClassroomModal
        open={addClassroomOpen}
        onOpenChange={setAddClassroomOpen}
        onAdd={handleAddClassroom}
      />
    </div>
  );
};

export default AdminDashboard;
