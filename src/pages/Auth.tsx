import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Lock, Mail } from "lucide-react";
const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Store role in localStorage for now (simulation)
    if (role) {
      localStorage.setItem("userRole", role);
      navigate("/");
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background Auras */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{
        animationDelay: "1s"
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{
        animationDelay: "2s"
      }} />
      </div>

      <Card className="w-full max-w-md relative z-10 glass-card animate-fade-in">
        <CardHeader className="space-y-3 pb-6">
          
          <CardTitle className="text-3xl font-bold text-center text-gradient">Welcome to CampusRover</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base">
            Select your role and login to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-primary" />
                User Role
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role" className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors h-12">
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
              <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input id="email" type="email" placeholder="your.email@campus.edu" value={email} onChange={e => setEmail(e.target.value)} required className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors h-12" />
            </div>

            <Button type="submit" className="w-full gradient-card hover:opacity-90 transition-all h-12 text-base font-semibold shadow-lg hover:shadow-xl">
              Login to Campus Rover
            </Button>

            <div className="text-center pt-2">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to home
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;