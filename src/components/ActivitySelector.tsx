import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Waves, 
  TreePine, 
  Bike, 
  Camera, 
  Tent,
  Sun,
  Snowflake,
  Fish,
  Plane,
  Zap,
  Wind
} from "lucide-react";

export interface Activity {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  optimalConditions: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    windSpeed: { min: number; max: number };
    precipitation: { min: number; max: number };
  };
}

const activities: Activity[] = [
  {
    id: 'trilha',
    name: 'Trilha',
    icon: Mountain,
    description: 'Caminhadas e trilhas em montanha',
    optimalConditions: {
      temperature: { min: 15, max: 28 },
      humidity: { min: 40, max: 70 },
      windSpeed: { min: 0, max: 15 },
      precipitation: { min: 0, max: 2 }
    }
  },
  {
    id: 'praia',
    name: 'Dia de Praia',
    icon: Waves,
    description: 'Atividades aquáticas e banho de sol',
    optimalConditions: {
      temperature: { min: 25, max: 35 },
      humidity: { min: 50, max: 80 },
      windSpeed: { min: 5, max: 20 },
      precipitation: { min: 0, max: 1 }
    }
  },
  {
    id: 'camping',
    name: 'Camping',
    icon: Tent,
    description: 'Acampamento ao ar livre',
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 30, max: 65 },
      windSpeed: { min: 0, max: 25 },
      precipitation: { min: 0, max: 5 }
    }
  },
  {
    id: 'ciclismo',
    name: 'Ciclismo',
    icon: Bike,
    description: 'Passeios de bicicleta',
    optimalConditions: {
      temperature: { min: 12, max: 30 },
      humidity: { min: 35, max: 75 },
      windSpeed: { min: 0, max: 20 },
      precipitation: { min: 0, max: 3 }
    }
  },
  {
    id: 'fotografia',
    name: 'Fotografia',
    icon: Camera,
    description: 'Fotografia de paisagem e natureza',
    optimalConditions: {
      temperature: { min: 5, max: 35 },
      humidity: { min: 20, max: 90 },
      windSpeed: { min: 0, max: 30 },
      precipitation: { min: 0, max: 15 }
    }
  },
  {
    id: 'floresta',
    name: 'Caminhada na Floresta',
    icon: TreePine,
    description: 'Exploração de áreas florestais',
    optimalConditions: {
      temperature: { min: 8, max: 26 },
      humidity: { min: 45, max: 85 },
      windSpeed: { min: 0, max: 18 },
      precipitation: { min: 0, max: 8 }
    }
  },
  {
    id: 'observacao',
    name: 'Observação Astronômica',
    icon: Sun,
    description: 'Observação de estrelas e planetas',
    optimalConditions: {
      temperature: { min: -5, max: 25 },
      humidity: { min: 20, max: 60 },
      windSpeed: { min: 0, max: 10 },
      precipitation: { min: 0, max: 0 }
    }
  },
  {
    id: 'esqui',
    name: 'Esportes de Neve',
    icon: Snowflake,
    description: 'Esqui e snowboard',
    optimalConditions: {
      temperature: { min: -15, max: 5 },
      humidity: { min: 60, max: 90 },
      windSpeed: { min: 0, max: 35 },
      precipitation: { min: 5, max: 50 }
    }
  },
  {
    id: 'pesca',
    name: 'Pesca',
    icon: Fish,
    description: 'Pesca em rios e lagos',
    optimalConditions: {
      temperature: { min: 15, max: 28 },
      humidity: { min: 50, max: 85 },
      windSpeed: { min: 0, max: 15 },
      precipitation: { min: 0, max: 10 }
    }
  },
  {
    id: 'parapente',
    name: 'Parapente',
    icon: Plane,
    description: 'Voo livre e parapente',
    optimalConditions: {
      temperature: { min: 18, max: 32 },
      humidity: { min: 30, max: 70 },
      windSpeed: { min: 8, max: 25 },
      precipitation: { min: 0, max: 1 }
    }
  },
  {
    id: 'tempestade',
    name: 'Observação de Tempestades',
    icon: Zap,
    description: 'Storm chasing seguro',
    optimalConditions: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 70, max: 95 },
      windSpeed: { min: 15, max: 60 },
      precipitation: { min: 10, max: 100 }
    }
  },
  {
    id: 'kitesurf',
    name: 'Kitesurf',
    icon: Wind,
    description: 'Kitesurf e windsurf',
    optimalConditions: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 60, max: 85 },
      windSpeed: { min: 15, max: 40 },
      precipitation: { min: 0, max: 5 }
    }
  }
];

interface ActivitySelectorProps {
  selectedActivity: Activity | null;
  onActivitySelect: (activity: Activity) => void;
}

const ActivitySelector = ({ selectedActivity, onActivitySelect }: ActivitySelectorProps) => {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-primary" />
          Seleção de Atividade
        </CardTitle>
        <CardDescription>
          Escolha uma atividade para calcular o Índice de Adequação (IAA)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            const isSelected = selectedActivity?.id === activity.id;
            const isHovered = hoveredActivity === activity.id;
            
            return (
              <div
                key={activity.id}
                className={`
                  relative p-4 rounded-lg border cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'bg-primary/20 border-primary/50 shadow-glow' 
                    : 'bg-card/30 border-border/30 hover:bg-card/50 hover:border-border/50'
                  }
                  ${isHovered ? 'transform scale-105' : ''}
                `}
                onClick={() => onActivitySelect(activity)}
                onMouseEnter={() => setHoveredActivity(activity.id)}
                onMouseLeave={() => setHoveredActivity(null)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`
                    p-3 rounded-full transition-colors duration-300
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                    }
                  `}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-center text-foreground">
                    {activity.name}
                  </span>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                      Selecionado
                    </Badge>
                  )}
                </div>
                
                {isHovered && (
                  <div className="absolute -top-2 -right-2 z-10 max-w-64 p-3 bg-popover border border-border rounded-lg shadow-atmospheric">
                    <p className="text-xs text-popover-foreground">
                      {activity.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {selectedActivity && (
          <div className="mt-6 p-4 bg-data-gradient rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2 text-foreground">Condições Ideais para {selectedActivity.name}:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• Temperatura: {selectedActivity.optimalConditions.temperature.min}°C - {selectedActivity.optimalConditions.temperature.max}°C</div>
              <div>• Umidade: {selectedActivity.optimalConditions.humidity.min}% - {selectedActivity.optimalConditions.humidity.max}%</div>
              <div>• Vento: {selectedActivity.optimalConditions.windSpeed.min} - {selectedActivity.optimalConditions.windSpeed.max} km/h</div>
              <div>• Precipitação: {selectedActivity.optimalConditions.precipitation.min} - {selectedActivity.optimalConditions.precipitation.max} mm</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySelector;
export { activities };