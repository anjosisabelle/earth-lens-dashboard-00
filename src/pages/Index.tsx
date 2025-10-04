import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapView } from "@/components/MapView";
import { Satellite, Search, Mountain, Waves, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

type Activity = "trilha" | "praia" | "piquenique" | null;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity>(null);
  const [adventureDate, setAdventureDate] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15, -50]);
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const activities = [
    { id: "trilha" as Activity, icon: Mountain, label: "Trilha" },
    { id: "praia" as Activity, icon: Waves, label: "Praia" },
    { id: "piquenique" as Activity, icon: TreePine, label: "Piquenique" },
  ];

  const handleAnalyze = () => {
    console.log("Analisando clima para:", { searchTerm, selectedActivity, adventureDate });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/20 backdrop-blur-md bg-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Satellite className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">ClimaCerto</h1>
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
                Selecione o local
              </h2>
              <div className="relative">
                <Input
                  placeholder="Cidade, parque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => console.log("Searching:", searchTerm)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Activity Type */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                Tipo de atividade:
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                        selectedActivity === activity.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-8 w-8 mb-2 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">
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
                Data da aventura
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
              onClick={handleAnalyze}
              className="w-full"
              size="lg"
              disabled={!searchTerm || !selectedActivity || !adventureDate}
            >
              Analisar Clima
            </Button>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapView center={mapCenter} zoom={4} marker={marker} />
        </main>
      </div>
    </div>
  );
};

export default Index;
