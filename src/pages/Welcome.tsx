import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Satellite, CloudRain, Wind, Thermometer, MapPin, TrendingUp } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Satellite,
      title: "NASA Data",
      description: "We use NASA's historical Earth observation data for accurate analysis"
    },
    {
      icon: CloudRain,
      title: "Climate Probabilities",
      description: "Calculate the probability of adverse conditions for your location and date"
    },
    {
      icon: Wind,
      title: "Multiple Variables",
      description: "Analyze temperature, precipitation, wind, humidity and air quality"
    },
    {
      icon: MapPin,
      title: "Any Location",
      description: "Select any point on the map or type the location name"
    },
    {
      icon: TrendingUp,
      title: "Historical Trends",
      description: "See how conditions have changed over the decades"
    },
    {
      icon: Thermometer,
      title: "Smart Suggestions",
      description: "AI recommends alternative locations when weather isn't ideal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-6">
            <Satellite className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            ClimaCerto
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Smart Outdoor Activity Planning
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Developed with NASA Earth observation data for Hackathon Brasil
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Climate Analysis
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* About Section */}
        <Card className="p-8 max-w-4xl mx-auto bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">About the Project</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              ClimaCerto uses decades of NASA Earth observation data to provide 
              information about the probability of specific climate conditions at any 
              location and time of year.
            </p>
            <p>
              Unlike weather forecasts, our system analyzes historical data to 
              determine the chances of extreme conditions such as: intense heat, extreme cold, 
              strong winds, heavy rain or uncomfortable conditions.
            </p>
            <p className="font-semibold text-foreground">
              Plan your outdoor activities with confidence, knowing exactly what 
              the climate probabilities are for your chosen location and date.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
