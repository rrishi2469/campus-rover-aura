import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SignUpDialog from "@/components/SignUpDialog";
import type { Session, User } from "@supabase/supabase-js";
const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is logged in, redirect to dashboard
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has the selected role
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (userRoles && userRoles.role === role) {
          toast({
            title: "Login Successful!",
            description: "Redirecting to dashboard...",
            className: "bg-primary text-primary-foreground",
          });
          navigate("/dashboard");
        } else {
          await supabase.auth.signOut();
          toast({
            title: "Error",
            description: "Selected role does not match your account",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setSignUpDialogOpen(true)}
              className="text-sm text-primary hover:underline font-medium transition-colors"
            >
              Sign up to create an account
            </button>
          </div>
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

            <Button 
              type="submit" 
              className="w-full gradient-card hover:opacity-90 transition-all h-12 text-base font-semibold shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to CampusRover"}
            </Button>

            <div className="text-center pt-2">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to home
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <SignUpDialog open={signUpDialogOpen} onOpenChange={setSignUpDialogOpen} />
    </div>;
};
export default Auth;