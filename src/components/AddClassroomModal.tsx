import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (classroom: {
    name: string;
    building: string;
    capacity: number;
    amenities: string[];
  }) => void;
}

const AddClassroomModal = ({ open, onOpenChange, onAdd }: AddClassroomModalProps) => {
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenitiesList = ["Projector", "AC", "Whiteboard", "Sound System", "Smart Board"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !building || !capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name,
      building,
      capacity: parseInt(capacity),
      amenities: selectedAmenities,
    });

    // Reset form
    setName("");
    setBuilding("");
    setCapacity("");
    setSelectedAmenities([]);
    onOpenChange(false);
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-primary/20">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gradient">
            Add New Classroom
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="classroom-name" className="text-sm font-semibold text-foreground">
              Classroom Name
            </Label>
            <Input
              id="classroom-name"
              type="text"
              placeholder="e.g., E-101"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building" className="text-sm font-semibold text-foreground">
              Building
            </Label>
            <Select value={building} onValueChange={setBuilding} required>
              <SelectTrigger id="building" className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Select building" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="Engineering Block">Engineering Block</SelectItem>
                <SelectItem value="Science Block">Science Block</SelectItem>
                <SelectItem value="Arts Block">Arts Block</SelectItem>
                <SelectItem value="Main Building">Main Building</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-semibold text-foreground">
              Capacity
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Amenities</Label>
            <div className="space-y-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-card hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Add Classroom
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassroomModal;
