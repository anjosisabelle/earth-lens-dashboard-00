import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Search, Globe, Navigation, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
  onZoomToLocation?: (location: Location) => void;
}

const LocationSelector = ({ onLocationSelect, selectedLocation, onZoomToLocation }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Predefined locations for quick access
  const predefinedLocations = [
    { lat: -23.5505, lng: -46.6333, name: "São Paulo, BR" },
    { lat: 40.7128, lng: -74.0060, name: "New York, USA" },
    { lat: 51.5074, lng: -0.1278, name: "London, UK" },
    { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
  ];

  // Search locations using Nominatim API
  useEffect(() => {
    const searchLocations = async () => {
      if (searchTerm.length < 2) {
        setSearchResults(predefinedLocations);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=10&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'ClimaCerto App'
            }
          }
        );
        const data = await response.json();
        
        const locations: Location[] = data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          name: item.display_name
        }));
        
        setSearchResults(locations);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationSelect({
        lat,
        lng,
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    }
  };

  const displayLocations = searchTerm.length < 2 ? predefinedLocations : searchResults;

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    if (onZoomToLocation) {
      onZoomToLocation(location);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search by Name with Dropdown */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search by City
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-input/50 h-10"
            >
              {selectedLocation?.name || "Type city name..."}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover" align="start">
            <Command>
              <CommandInput 
                placeholder="Search location..." 
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value);
                  if (value && !open) {
                    setOpen(true);
                  }
                }}
              />
              <CommandList>
                {isSearching ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">Searching...</span>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup heading={searchTerm.length < 2 ? "SUGGESTED LOCATIONS" : "SEARCH RESULTS"}>
                      {displayLocations.map((location, index) => (
                        <CommandItem
                          key={`${location.lat}-${location.lng}-${index}`}
                          value={location.name}
                          onSelect={() => handleLocationSelect(location)}
                        >
                          <MapPin className="mr-2 h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm">{location.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedLocation?.lat === location.lat && selectedLocation?.lng === location.lng
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Manual Coordinate Entry */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Manual Coordinates
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="lat" className="text-xs">Latitude</Label>
            <Input
              id="lat"
              placeholder="-23.5505"
              value={coordinates.lat}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lng" className="text-xs">Longitude</Label>
            <Input
              id="lng"
              placeholder="-46.6333"
              value={coordinates.lng}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
              className="bg-input/50"
            />
          </div>
        </div>
        <Button 
          onClick={handleCoordinateSubmit}
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={!coordinates.lat || !coordinates.lng}
        >
          <Globe className="h-4 w-4 mr-2" />
          Set Location
        </Button>
      </div>

      {/* Selected Location */}
      {selectedLocation && (
        <Card className="bg-data-gradient border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="bg-primary/20 text-primary mb-2">
                  Active Location
                </Badge>
                <h4 className="font-semibold text-foreground">{selectedLocation.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">QUICK ACCESS</Label>
        <div className="flex flex-wrap gap-2">
          {predefinedLocations.slice(0, 4).map((location) => (
            <Button
              key={`quick-${location.lat}-${location.lng}`}
              variant="outline"
              size="sm"
              onClick={() => handleLocationSelect(location)}
              className="bg-card/20 hover:bg-card/40 border-border/20 text-xs"
            >
              {location.name.split(',')[0]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
