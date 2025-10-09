import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapView } from "@/components/MapView";
import { ClimateAnalysis } from "@/components/ClimateAnalysis";
import LocationSelector from "@/components/LocationSelector";
import { Satellite, Search, Mountain, Waves, TreePine, Bike, Tent, Camera, Fish, Sun, Wind, Snowflake, Umbrella, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Activity = "trilha" | "praia" | "piquenique" | "ciclismo" | "camping" | "fotografia" | "pesca" | "surf" | "parapente" | "esqui" | "caiaque" | "observacao" | null;

const Index = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(null);
  const [adventureDate, setAdventureDate] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15, -50]);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const activities = [
    { id: "trilha" as Activity, icon: Mountain, label: "Hiking" },
    { id: "praia" as Activity, icon: Waves, label: "Beach" },
    { id: "piquenique" as Activity, icon: TreePine, label: "Picnic" },
    { id: "ciclismo" as Activity, icon: Bike, label: "Cycling" },
    { id: "camping" as Activity, icon: Tent, label: "Camping" },
    { id: "fotografia" as Activity, icon: Camera, label: "Photography" },
    { id: "pesca" as Activity, icon: Fish, label: "Fishing" },
    { id: "surf" as Activity, icon: Waves, label: "Surfing" },
    { id: "parapente" as Activity, icon: Wind, label: "Paragliding" },
    { id: "esqui" as Activity, icon: Snowflake, label: "Skiing" },
    { id: "caiaque" as Activity, icon: Waves, label: "Kayaking" },
    { id: "observacao" as Activity, icon: Sun, label: "Stargazing" },
  ];

  const handleAnalyze = () => {
    console.log("Analyzing climate for:", { selectedLocation, selectedActivity, adventureDate });
  };

  const handleFetchWeather = async () => {
    if (!marker) {
      toast({
        title: "Location not selected",
        description: "Please select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    if (!adventureDate) {
      toast({
        title: "Date not selected",
        description: "Please select the adventure date.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format date to YYYYMMDD
      const dateFormatted = adventureDate.replace(/-/g, "");
      
      const { data, error } = await supabase.functions.invoke("fetch_weather", {
        body: {
          lat: marker[0],
          lon: marker[1],
          start: dateFormatted,
          end: dateFormatted,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Climate data updated successfully!",
        description: "Weather data has been updated for the selected location.",
      });
    } catch (error) {
      console.error("Error fetching climate data:", error);
      toast({
        title: "Error fetching data",
        description: "Could not fetch climate data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleZoomToLocation = (location: { lat: number; lng: number; name: string }) => {
    setMapCenter([location.lat, location.lng]);
    setMapZoom(12); // Zoom in when selecting from dropdown
    setMarker([location.lat, location.lng]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/20 backdrop-blur-md bg-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Satellite className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">ClimaCerto</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              title="Página inicial"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Location Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                Select location
              </h2>
              <LocationSelector
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  setMarker([location.lat, location.lng]);
                }}
                selectedLocation={selectedLocation}
                onZoomToLocation={handleZoomToLocation}
              />
            </div>

            {/* Activity Type */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                Activity type:
              </h2>
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                        selectedActivity === activity.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-xs font-medium text-card-foreground">
                        {activity.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adventure Date */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                Adventure date
              </h2>
              <Input
                type="date"
                value={adventureDate}
                onChange={(e) => setAdventureDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleFetchWeather}
              className="w-full"
              size="lg"
              disabled={!selectedLocation || !selectedActivity || !adventureDate}
            >
              <Search className="h-4 w-4 mr-2" />
              Fetch Weather Data
            </Button>
            
            <Button
              onClick={handleAnalyze}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={!selectedLocation || !selectedActivity || !adventureDate}
            >
              Analyze Climate
            </Button>
          </div>
        </aside>

        {/* Map and Analysis */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <MapView 
              center={mapCenter} 
              zoom={mapZoom} 
              marker={marker}
              onLocationSelect={(lat, lon) => {
                setMarker([lat, lon]);
              }}
              onZoomChange={(zoom) => setMapZoom(zoom)}
            />
          </div>
          
          {/* Climate Analysis Section */}
          {selectedLocation && selectedActivity && adventureDate && (
            <div className="border-t border-border bg-card p-4">
              <ClimateAnalysis 
                location={selectedLocation.name}
                activity={selectedActivity}
                date={adventureDate}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
