import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  Eye, 
  Zap, 
  Sun, 
  CloudRain,
  Gauge,
  TreePine
} from "lucide-react";

interface ClimateVariable {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unit: string;
  category: 'atmospheric' | 'surface' | 'environmental';
}

const climateVariables: ClimateVariable[] = [
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Near-surface air temperature',
    icon: <Thermometer className="h-4 w-4" />,
    unit: '°C',
    category: 'atmospheric'
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    description: 'Rain and snow amount',
    icon: <Droplets className="h-4 w-4" />,
    unit: 'mm',
    category: 'atmospheric'
  },
  {
    id: 'wind_speed',
    name: 'Wind Speed',
    description: 'Near-surface wind speed',
    icon: <Wind className="h-4 w-4" />,
    unit: 'm/s',
    category: 'atmospheric'
  },
  {
    id: 'humidity',
    name: 'Relative Humidity',
    description: 'Air relative humidity',
    icon: <Cloud className="h-4 w-4" />,
    unit: '%',
    category: 'atmospheric'
  },
  {
    id: 'visibility',
    name: 'Visibilidade',
    description: 'Distância de visibilidade horizontal',
    icon: <Eye className="h-4 w-4" />,
    unit: 'km',
    category: 'environmental'
  },
  {
    id: 'solar_radiation',
    name: 'Radiação Solar',
    description: 'Radiação solar incidente',
    icon: <Sun className="h-4 w-4" />,
    unit: 'W/m²',
    category: 'environmental'
  },
  {
    id: 'cloud_cover',
    name: 'Cobertura de Nuvens',
    description: 'Percentual de cobertura de nuvens',
    icon: <CloudRain className="h-4 w-4" />,
    unit: '%',
    category: 'atmospheric'
  },
  {
    id: 'pressure',
    name: 'Pressão Atmosférica',
    description: 'Pressão barométrica ao nível do mar',
    icon: <Gauge className="h-4 w-4" />,
    unit: 'hPa',
    category: 'atmospheric'
  },
  {
    id: 'air_quality',
    name: 'Qualidade do Ar',
    description: 'Índice de qualidade do ar (AQI)',
    icon: <TreePine className="h-4 w-4" />,
    unit: 'AQI',
    category: 'environmental'
  }
];

interface ClimateFiltersProps {
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
}

const ClimateFilters = ({ selectedVariables, onVariablesChange }: ClimateFiltersProps) => {
  const handleVariableToggle = (variableId: string) => {
    const isSelected = selectedVariables.includes(variableId);
    if (isSelected) {
      onVariablesChange(selectedVariables.filter(id => id !== variableId));
    } else {
      onVariablesChange([...selectedVariables, variableId]);
    }
  };

  const selectAllInCategory = (category: string) => {
    const categoryVariables = climateVariables
      .filter(v => v.category === category)
      .map(v => v.id);
    
    const newSelection = [...new Set([...selectedVariables, ...categoryVariables])];
    onVariablesChange(newSelection);
  };

  const clearAllInCategory = (category: string) => {
    const categoryVariables = climateVariables
      .filter(v => v.category === category)
      .map(v => v.id);
    
    const newSelection = selectedVariables.filter(id => !categoryVariables.includes(id));
    onVariablesChange(newSelection);
  };

  const categoryNames = {
    atmospheric: 'Atmospheric Variables',
    surface: 'Surface Variables',
    environmental: 'Environmental Variables'
  };

  const categories = ['atmospheric', 'environmental'] as const;

  return (
    <div className="space-y-6">
      {/* Resumo de Seleção */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-foreground">Selected Variables</h3>
          <p className="text-sm text-muted-foreground">
            {selectedVariables.length} of {climateVariables.length} variables
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onVariablesChange(climateVariables.map(v => v.id))}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onVariablesChange([])}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Tags das Variáveis Selecionadas */}
      {selectedVariables.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">ACTIVE VARIABLES</Label>
          <div className="flex flex-wrap gap-2">
            {selectedVariables.map(varId => {
              const variable = climateVariables.find(v => v.id === varId);
              if (!variable) return null;
              
              return (
                <Badge 
                  key={varId}
                  variant="secondary"
                  className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30"
                  onClick={() => handleVariableToggle(varId)}
                >
                  {variable.icon}
                  <span className="ml-1">{variable.name}</span>
                  <span className="ml-1 opacity-60">×</span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorias de Variáveis */}
      {categories.map(category => {
        const categoryVariables = climateVariables.filter(v => v.category === category);
        const selectedInCategory = categoryVariables.filter(v => selectedVariables.includes(v.id));
        
        return (
          <Card key={category} className="bg-card/30 backdrop-blur-sm border-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{categoryNames[category]}</h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedInCategory.length} de {categoryVariables.length} selecionadas
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectAllInCategory(category)}
                    className="text-xs h-7"
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearAllInCategory(category)}
                    className="text-xs h-7"
                  >
                    None
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryVariables.map(variable => (
                  <div
                    key={variable.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border/20 hover:border-primary/40 bg-background/20 hover:bg-background/40 transition-colors cursor-pointer"
                    onClick={() => handleVariableToggle(variable.id)}
                  >
                    <Checkbox
                      checked={selectedVariables.includes(variable.id)}
                      onCheckedChange={() => handleVariableToggle(variable.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary">{variable.icon}</span>
                        <Label className="font-medium cursor-pointer text-sm">
                          {variable.name}
                        </Label>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {variable.unit}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {variable.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ClimateFilters;