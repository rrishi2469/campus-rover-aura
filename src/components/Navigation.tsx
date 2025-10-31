import { Button } from "@/components/ui/button";
const Navigation = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold text-foreground">CampusRover</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
            Contact
          </a>
        </div>
        
        <Button 
          variant="default" 
          className="gradient-card hover:opacity-90 transition-opacity"
          onClick={() => window.location.href = '/auth'}
        >
          Get Started
        </Button>
      </div>
    </nav>;
};
export default Navigation;