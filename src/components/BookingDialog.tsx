import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Building2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const classroomsByBuilding: Record<string, string[]> = {
  A: ["A101", "A102", "A103", "A104", "A105"],
  B: ["B201", "B202", "B203", "B204", "B205"],
  C: ["C301", "C302", "C303", "C304", "C305"],
  D: ["D401", "D402", "D403", "D404", "D405"],
  Auditorium: ["Main Auditorium", "Mini Auditorium", "Seminar Hall 1", "Seminar Hall 2", "Conference Room"]
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
];

const bookingTypes = [
  { value: "lecture", label: "Lecture" },
  { value: "club", label: "Club Activity" },
  { value: "event", label: "Event" }
];

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [attendees, setAttendees] = useState("");
  const [building, setBuilding] = useState("");
  const [classroom, setClassroom] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (!attendees || !building || !classroom || !day || !time || !bookingType) {
      toast.error("Please fill in all fields");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    toast.success("Classroom Requested!", {
      description: `${classroom} has been requested for ${day} at ${time}`,
      duration: 4000,
    });
    
    // Reset form
    setAttendees("");
    setBuilding("");
    setClassroom("");
    setDay("");
    setTime("");
    setBookingType("");
    setShowConfirmation(false);
    onOpenChange(false);
  };

  const handleBuildingChange = (value: string) => {
    setBuilding(value);
    setClassroom(""); // Reset classroom when building changes
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              Confirm Booking
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please review your classroom booking details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="glass-card p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Classroom</p>
                <p className="font-semibold font-helvetica">{classroom}</p>
              </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Day</p>
                  <p className="font-semibold">{day}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold font-helvetica">{time}</p>
              </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Attendees</p>
                <p className="font-semibold font-helvetica">{attendees}</p>
              </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold capitalize">{bookingType}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="flex-1 gradient-card text-white hover:opacity-90"
              >
                Request Classroom
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-primary/20 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Book Your Classroom
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Fill in the details to request a classroom booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Number of Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendees" className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Approximate Number of Attendees
            </Label>
            <Input
              id="attendees"
              type="number"
              placeholder="Enter number of attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="border-border focus:border-primary font-helvetica"
              min="1"
            />
          </div>

          {/* Building Selection */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Building Selection
            </Label>
            <Select value={building} onValueChange={handleBuildingChange}>
              <SelectTrigger className="border-border focus:border-primary">
                <SelectValue placeholder="Select a building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Building A</SelectItem>
                <SelectItem value="B">Building B</SelectItem>
                <SelectItem value="C">Building C</SelectItem>
                <SelectItem value="D">Building D</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classroom Selection */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary" />
              Classroom Selection
            </Label>
            <Select 
              value={classroom} 
              onValueChange={setClassroom}
              disabled={!building}
            >
              <SelectTrigger className="border-border focus:border-primary disabled:opacity-50">
                <SelectValue placeholder={building ? "Select a classroom" : "Please select a building first"} />
              </SelectTrigger>
              <SelectContent>
                {building && classroomsByBuilding[building]?.map((room) => (
                  <SelectItem key={room} value={room} className="font-helvetica">
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Day
            </Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="border-border focus:border-primary">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="border-border focus:border-primary">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((t) => (
                  <SelectItem key={t} value={t} className="font-helvetica">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Type */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Booking Type
            </Label>
            <Select value={bookingType} onValueChange={setBookingType}>
              <SelectTrigger className="border-border focus:border-primary">
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                {bookingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full gradient-card text-white hover:opacity-90 glow-blue font-semibold h-12 text-base"
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
