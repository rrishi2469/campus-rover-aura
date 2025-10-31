import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Calendar, Bell, Monitor } from "lucide-react";

const features = [
  {
    icon: UserCircle,
    title: "Role-based Access",
    subtitle: "Teachers, Students and Club Heads",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Smart Availability Checker",
    subtitle: "Quickly check the availability of desired classrooms",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Bell,
    title: "Automated Waitlist Alerts",
    subtitle: "Conreacioners",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: Monitor,
    title: "Real-time Dashboard",
    subtitle: "smooth allotment functioning",
    gradient: "from-purple-500 to-pink-500",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center glow-blue`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
