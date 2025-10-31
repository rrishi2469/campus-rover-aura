import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingDialog } from "@/components/BookingDialog";

const Dashboard = () => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  // Dummy booked classrooms data
  const bookedSlots = [{
    day: 0,
    time: 1,
    room: "A101",
    type: "lecture"
  }, {
    day: 0,
    time: 3,
    room: "B204",
    type: "club"
  }, {
    day: 1,
    time: 2,
    room: "C301",
    type: "lecture"
  }, {
    day: 2,
    time: 0,
    room: "A101",
    type: "event"
  }, {
    day: 2,
    time: 4,
    room: "D102",
    type: "club"
  }, {
    day: 3,
    time: 1,
    room: "B204",
    type: "lecture"
  }, {
    day: 3,
    time: 5,
    room: "A101",
    type: "event"
  }, {
    day: 4,
    time: 3,
    room: "C301",
    type: "club"
  }, {
    day: 4,
    time: 6,
    room: "D102",
    type: "lecture"
  }];
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
  const getBookedSlot = (dayIndex: number, timeIndex: number) => {
    return bookedSlots.find(slot => slot.day === dayIndex && slot.time === timeIndex);
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
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
              Hi, <span className="text-[#272727]">Rishi</span>!
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
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Days Header */}
              <div className="grid grid-cols-6 gap-4 mb-4">
                <div className="text-sm font-semibold text-muted-foreground"></div>
                {days.map(day => <div key={day} className="text-center">
                    <div className="text-sm font-bold text-foreground">{day}</div>
                  </div>)}
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                {timeSlots.map((time, timeIndex) => <div key={time} className="grid grid-cols-6 gap-4">
                    <div className="text-sm font-medium text-muted-foreground py-3">
                      {time}
                    </div>
                    {days.map((day, dayIndex) => {
                  const bookedSlot = getBookedSlot(dayIndex, timeIndex);
                  return <div key={`${day}-${time}`} className={`
                            rounded-lg border-2 p-3 min-h-[60px] transition-all
                            ${bookedSlot ? `${getBookingColor(bookedSlot.type)} border-2` : "border-border/50 hover:border-primary/30 hover:bg-muted/30 cursor-pointer"}
                          `}>
                          {bookedSlot && <div className="text-sm font-semibold">
                              {bookedSlot.room}
                            </div>}
                        </div>;
                })}
                  </div>)}
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
        
        <BookingDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      </div>
    </div>
  );
};
export default Dashboard;