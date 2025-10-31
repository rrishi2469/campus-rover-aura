import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Aura glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-glow/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Simplify Campus Scheduling
              <br />
              <span className="text-gradient">Book Classrooms in Seconds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              An intuitive web app for teachers, students, and club heads to reserve campus rooms effortlessly.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="gradient-card text-white hover:opacity-90 transition-opacity glow-blue px-8 py-6 text-lg font-semibold"
                onClick={() => window.location.href = '/dashboard'}
              >
                Try Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 hover:bg-muted px-8 py-6 text-lg font-semibold group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Overview
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative aura-glow">
              <img 
                src={heroMockup} 
                alt="Campus Rover Dashboard Interface" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
