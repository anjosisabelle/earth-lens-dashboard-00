import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Satellite, CloudRain, Wind, Thermometer, MapPin, TrendingUp } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Satellite,
      title: "NASA Data",
      description: "We use NASA's historical Earth observation data for accurate analysis",
      detailedDescription: "ClimaCerto integrates data from multiple NASA Earth observation missions, including MODIS (Moderate Resolution Imaging Spectroradiometer), TRMM (Tropical Rainfall Measuring Mission), and MERRA-2 (Modern-Era Retrospective analysis for Research and Applications). This gives us access to decades of reliable climate data with global coverage. We process temperature, precipitation, wind speed, humidity, and air quality data from these sources to provide accurate historical climate analysis for any location on Earth."
    },
    {
      icon: CloudRain,
      title: "Climate Probabilities",
      description: "Calculate the probability of adverse conditions for your location and date",
      detailedDescription: "Our probability engine analyzes 20+ years of historical climate data to calculate the likelihood of adverse weather conditions on any given date. We determine the probability of events such as heavy rainfall (>50mm/day), extreme heat (>35°C), strong winds (>40km/h), and other uncomfortable conditions. This helps you understand the risk level for your outdoor activity and make informed decisions about when and where to go."
    },
    {
      icon: Wind,
      title: "Multiple Variables",
      description: "Analyze temperature, precipitation, wind, humidity and air quality",
      detailedDescription: "ClimaCerto monitors five critical climate variables: Temperature (daily min/max/avg), Precipitation (total and intensity), Wind Speed (average and gusts), Relative Humidity (%), and Air Quality Index (PM2.5, PM10, and other pollutants). Each variable is analyzed separately and in combination to provide a comprehensive Activity Suitability Index (ASI) that tells you exactly which conditions might impact your outdoor plans."
    },
    {
      icon: MapPin,
      title: "Any Location",
      description: "Select any point on the map or type the location name",
      detailedDescription: "Our platform supports global location search powered by OpenStreetMap's Nominatim geocoding service. You can search for any city, neighborhood, district, beach, park, or even specific addresses. Simply start typing and we'll show you relevant results. You can also click directly on the interactive map to select any point on Earth. The system will automatically fetch the nearest available climate data for your selected location."
    },
    {
      icon: TrendingUp,
      title: "Historical Trends",
      description: "See how conditions have changed over the decades",
      detailedDescription: "Visualize climate change in action with our historical trend charts. Compare data from different decades to see how temperatures, rainfall patterns, and other climate variables have evolved at your location. Our charts show yearly averages, seasonal variations, and long-term trends from 2000 to present. This helps you understand not just current conditions, but also how reliable historical patterns are for future planning."
    },
    {
      icon: Thermometer,
      title: "Smart Suggestions",
      description: "AI recommends alternative locations when weather isn't ideal",
      detailedDescription: "When conditions at your chosen location aren't favorable, our AI recommendation engine suggests alternative locations within a reasonable distance that have better climate probabilities for your selected dates and activity. The system considers your activity type (beach, hiking, cycling, etc.) and finds nearby locations with lower probability of adverse conditions, helping you plan the perfect outdoor experience."
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
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer hover:scale-105"
                onClick={() => setSelectedFeature(index)}
              >
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <p className="text-xs text-primary mt-4 font-medium">Clique para saber mais →</p>
              </Card>
            );
          })}
        </div>

        {/* Feature Detail Dialog */}
        <Dialog open={selectedFeature !== null} onOpenChange={(open) => !open && setSelectedFeature(null)}>
          <DialogContent className="max-w-2xl">
            {selectedFeature !== null && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = features[selectedFeature].icon;
                      return <Icon className="h-8 w-8 text-primary" />;
                    })()}
                    <DialogTitle className="text-2xl">{features[selectedFeature].title}</DialogTitle>
                  </div>
                  <DialogDescription className="text-base leading-relaxed pt-4">
                    {features[selectedFeature].detailedDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => {
                    setSelectedFeature(null);
                    navigate('/dashboard');
                  }}>
                    Experimentar agora
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
