import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  LogOut, 
  Users, 
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
import { Badge } from "@/components/ui/badge";

interface BookingRequest {
  id: string;
  classroom: string;
  building: string;
  requester: string;
  role: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  purpose: string;
  attendance: number;
}

interface Classroom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  amenities: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [addClassroomOpen, setAddClassroomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"requests" | "classrooms">("requests");
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: "1",
      classroom: "E-101",
      building: "Engineering Block",
      requester: "John Smith",
      role: "Student Representative",
      date: "2025-11-20",
      timeStart: "9:00 AM",
      timeEnd: "11:00 AM",
      purpose: "Machine Learning Workshop",
      attendance: 45,
    },
    {
      id: "2",
      classroom: "S-204",
      building: "Science Block",
      requester: "Dr. Sarah Johnson",
      role: "Teacher",
      date: "2025-11-21",
      timeStart: "2:00 PM",
      timeEnd: "4:00 PM",
      purpose: "Chemistry Lab Session",
      attendance: 30,
    },
    {
      id: "3",
      classroom: "A-301",
      building: "Arts Block",
      requester: "Music Club",
      role: "Club Head",
      date: "2025-11-22",
      timeStart: "5:00 PM",
      timeEnd: "7:00 PM",
      purpose: "Annual Music Festival Practice",
      attendance: 60,
    },
    {
      id: "4",
      classroom: "M-102",
      building: "Main Building",
      requester: "Emma Davis",
      role: "Student Representative",
      date: "2025-11-23",
      timeStart: "10:00 AM",
      timeEnd: "12:00 PM",
      purpose: "Career Guidance Seminar",
      attendance: 80,
    },
  ]);

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "E-101",
      building: "Engineering Block",
      capacity: 50,
      amenities: ["Projector", "AC", "Whiteboard", "Smart Board"],
    },
    {
      id: "2",
      name: "E-202",
      building: "Engineering Block",
      capacity: 40,
      amenities: ["Projector", "AC", "Whiteboard"],
    },
    {
      id: "3",
      name: "S-204",
      building: "Science Block",
      capacity: 35,
      amenities: ["Projector", "Whiteboard"],
    },
    {
      id: "4",
      name: "S-305",
      building: "Science Block",
      capacity: 30,
      amenities: ["AC", "Whiteboard", "Sound System"],
    },
    {
      id: "5",
      name: "A-301",
      building: "Arts Block",
      capacity: 60,
      amenities: ["Projector", "AC", "Sound System", "Smart Board"],
    },
    {
      id: "6",
      name: "A-102",
      building: "Arts Block",
      capacity: 45,
      amenities: ["Projector", "Whiteboard"],
    },
    {
      id: "7",
      name: "M-102",
      building: "Main Building",
      capacity: 100,
      amenities: ["Projector", "AC", "Whiteboard", "Sound System", "Smart Board"],
    },
    {
      id: "8",
      name: "M-205",
      building: "Main Building",
      capacity: 70,
      amenities: ["Projector", "AC", "Whiteboard", "Sound System"],
    },
  ]);

  const [approvedToday, setApprovedToday] = useState(12);

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

  // Verify admin role
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
        }
      }
    };

    verifyAdmin();
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleAcceptRequest = (id: string) => {
    setBookingRequests(bookingRequests.filter((req) => req.id !== id));
    setApprovedToday(approvedToday + 1);
    toast({
      title: "Request Approved",
      description: "Booking request has been approved successfully",
    });
  };

  const handleDeclineRequest = (id: string) => {
    setBookingRequests(bookingRequests.filter((req) => req.id !== id));
    toast({
      title: "Request Declined",
      description: "Booking request has been declined",
      variant: "destructive",
    });
  };

  const handleAddClassroom = (classroom: Omit<Classroom, "id">) => {
    const newClassroom = {
      ...classroom,
      id: Date.now().toString(),
    };
    setClassrooms([...classrooms, newClassroom]);
    toast({
      title: "Classroom Added",
      description: `${classroom.name} has been added successfully`,
    });
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Calendar, label: "Bookings", active: false },
    { icon: Building2, label: "Classrooms", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help", active: false },
  ];

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active 
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
              <p className="text-3xl font-bold text-foreground">{bookingRequests.length}</p>
              <div className="mt-4 space-y-2">
                {bookingRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{req.classroom} - {req.requester}</span>
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
              <p className="text-sm text-muted-foreground mb-2">Approved Today</p>
              <p className="text-3xl font-bold text-foreground">{approvedToday}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Morning sessions</span>
                  <span className="text-emerald-600 font-medium">7 approved</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Afternoon sessions</span>
                  <span className="text-emerald-600 font-medium">5 approved</span>
                </div>
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
              {bookingRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {bookingRequests.length}
                </span>
              )}
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
              {bookingRequests.length === 0 ? (
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
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                          Requester
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">
                          Date & Time
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden xl:table-cell">
                          Purpose
                        </th>
                        <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bookingRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{request.classroom}</p>
                              <p className="text-sm text-muted-foreground">{request.building}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div>
                              <p className="font-medium text-foreground">{request.requester}</p>
                              <p className="text-sm text-muted-foreground">{request.role}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div>
                              <p className="font-medium text-foreground">{request.date}</p>
                              <p className="text-sm text-muted-foreground">{request.timeStart} - {request.timeEnd}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden xl:table-cell">
                            <div>
                              <p className="text-foreground truncate max-w-[200px]">{request.purpose}</p>
                              <p className="text-sm text-muted-foreground">{request.attendance} attendees</p>
                            </div>
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

          {activeTab === "classrooms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{classroom.name}</h4>
                      <p className="text-sm text-muted-foreground">{classroom.building}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{classroom.capacity}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {classroom.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
