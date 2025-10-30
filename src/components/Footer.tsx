const Footer = () => {
  return (
    <footer id="contact" className="py-12 px-6 bg-card border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-card"></div>
            <span className="text-lg font-bold text-foreground">Campus Rover</span>
          </div>
          
          <div className="flex space-x-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </a>
          </div>
          
          <p className="text-muted-foreground text-sm">
            © 2025 Campus Rover. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
