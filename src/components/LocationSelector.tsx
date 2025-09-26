import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Globe, Navigation } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

const LocationSelector = ({ onLocationSelect, selectedLocation }: LocationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  // Localizações predefinidas para demonstração
  const predefinedLocations = [
    { lat: -23.5505, lng: -46.6333, name: "São Paulo, BR" },
    { lat: 40.7128, lng: -74.0060, name: "Nova York, EUA" },
    { lat: 51.5074, lng: -0.1278, name: "Londres, Reino Unido" },
    { lat: 35.6762, lng: 139.6503, name: "Tóquio, Japão" },
    { lat: -15.7942, lng: -47.8822, name: "Brasília, BR" },
    { lat: 48.8566, lng: 2.3522, name: "Paris, França" },
  ];

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

  const filteredLocations = predefinedLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Busca por Nome */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar por Cidade
        </Label>
        <div className="relative">
          <Input
            placeholder="Digite o nome da cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input/50 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Localizações Sugeridas */}
      {searchTerm && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">LOCALIZAÇÕES SUGERIDAS</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredLocations.map((location) => (
              <Button
                key={`${location.lat}-${location.lng}`}
                variant="outline"
                size="sm"
                onClick={() => onLocationSelect(location)}
                className="justify-start h-auto p-3 bg-card/30 hover:bg-card/50 border-border/30"
              >
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Entrada Manual de Coordenadas */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Coordenadas Manuais
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
          Definir Localização
        </Button>
      </div>

      {/* Localização Selecionada */}
      {selectedLocation && (
        <Card className="bg-data-gradient border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="bg-primary/20 text-primary mb-2">
                  Localização Ativa
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

      {/* Localizações Rápidas */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">ACESSO RÁPIDO</Label>
        <div className="flex flex-wrap gap-2">
          {predefinedLocations.slice(0, 4).map((location) => (
            <Button
              key={`quick-${location.lat}-${location.lng}`}
              variant="outline"
              size="sm"
              onClick={() => onLocationSelect(location)}
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