import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Users, CheckCircle, Clock, Building2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import AddClassroomModal from "@/components/AddClassroomModal";
import { Card, CardContent } from "@/components/ui/card";
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
      className: "bg-green-500 text-white",
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
      className: "bg-green-500 text-white",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aura glow effects */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* Header */}
      <header className="gradient-card border-b border-primary/20 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gradient">CampusBook Admin</h1>
                <p className="text-xs text-muted-foreground hidden md:block">Administrative Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAddClassroomOpen(true)}
                className="gradient-card hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Add Classroom</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome, Admin!</h2>
          <p className="text-muted-foreground">Manage classroom bookings and requests efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                  <p className="text-3xl font-bold text-orange-500">{bookingRequests.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Classrooms</p>
                  <p className="text-3xl font-bold text-primary">{classrooms.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved Today</p>
                  <p className="text-3xl font-bold text-green-500">{approvedToday}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Booking Requests */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-foreground">Pending Booking Requests</h3>
            {bookingRequests.length > 0 && (
              <Badge className="bg-orange-500 text-white">{bookingRequests.length}</Badge>
            )}
          </div>

          {bookingRequests.length === 0 ? (
            <Card className="gradient-card border-primary/20">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending requests at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookingRequests.map((request) => (
                <Card
                  key={request.id}
                  className="gradient-card border-primary/20 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-xl font-bold text-foreground mb-1">{request.classroom}</h4>
                          <p className="text-sm text-muted-foreground">
                            Requested by <span className="font-semibold text-foreground">{request.requester}</span> ({request.role})
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4 text-primary" />
                            <span>{request.building}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{request.date} • {request.timeStart} - {request.timeEnd}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{request.attendance} attendees</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Purpose:</span> {request.purpose}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 md:min-w-[120px]">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleDeclineRequest(request.id)}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* All Classrooms */}
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold text-foreground mb-4">All Classrooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className="gradient-card border-primary/20 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-1">{classroom.name}</h4>
                      <p className="text-sm text-muted-foreground">{classroom.building}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Capacity: {classroom.capacity}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {classroom.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AddClassroomModal
        open={addClassroomOpen}
        onOpenChange={setAddClassroomOpen}
        onAdd={handleAddClassroom}
      />
    </div>
  );
};

export default AdminDashboard;
