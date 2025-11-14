import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Lock, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpDialog = ({ open, onOpenChange }: SignUpDialogProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Insert the role into user_roles table
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: signUpData.user.id,
            role: role as "student" | "teacher" | "club",
          }]);

        if (roleError) throw roleError;

        toast({
          title: "Registration Successful!",
          description: `Welcome ${username}! You can now log in.`,
          className: "bg-primary text-primary-foreground",
        });

        // Reset form and close dialog
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gradient">
            Create Your Account
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Join CampusRover today
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-username" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Username
            </Label>
            <Input
              id="signup-username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-role" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-primary" />
              User Role
            </Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="signup-role" className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors h-11">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="student" className="cursor-pointer hover:bg-primary/10">
                  Student Representative
                </SelectItem>
                <SelectItem value="teacher" className="cursor-pointer hover:bg-primary/10">
                  Teacher
                </SelectItem>
                <SelectItem value="club" className="cursor-pointer hover:bg-primary/10">
                  Club Head
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="your.email@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Confirm Password
            </Label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-card hover:opacity-90 transition-all h-11 text-base font-semibold shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
