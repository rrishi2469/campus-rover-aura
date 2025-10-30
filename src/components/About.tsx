const About = () => {
  return (
    <section id="about" className="py-20 px-6 bg-card">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            About the Platform
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Our classroom booking system streamlines how institutes manage space allocation. 
            Whether it's a lecture, a club event, or a guest seminar — book rooms instantly, 
            avoid clashes, and stay notified.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
