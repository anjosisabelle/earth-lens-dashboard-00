import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin
} from "lucide-react";
import { Activity } from "@/components/ActivitySelector";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  timestamp: string;
}

interface IAACalculationProps {
  location: { lat: number; lng: number; name: string } | null;
  activity: Activity | null;
  dateRange: { start: string; end: string };
}

// Simula dados históricos da NASA baseados na localização
const generateHistoricalData = (lat: number, lng: number, days: number = 30): WeatherData[] => {
  const data: WeatherData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    
    // Simula variações baseadas na latitude (aproximação simples de clima)
    const latFactor = Math.abs(lat) / 90; // 0-1 onde 1 é polo
    const seasonFactor = Math.sin((date.getMonth() * Math.PI) / 6); // Variação sazonal
    
    // Temperatura base ajustada por latitude e longitude
    const baseTemp = (30 - (latFactor * 40)) + (seasonFactor * 10) + (Math.random() - 0.5) * 15;
    
    // Umidade base (costas têm mais umidade)
    const coastalFactor = Math.sin(lng * Math.PI / 180) * 0.3;
    const baseHumidity = 50 + (coastalFactor * 30) + (Math.random() * 40);
    
    // Velocidade do vento
    const baseWindSpeed = 5 + (latFactor * 15) + (Math.random() * 20);
    
    // Precipitação (mais comum em certas latitudes)
    const precipitationChance = Math.max(0, 0.3 - latFactor * 0.2);
    const basePrecipitation = Math.random() < precipitationChance ? Math.random() * 20 : 0;
    
    data.push({
      temperature: Math.max(-30, Math.min(50, baseTemp)),
      humidity: Math.max(10, Math.min(100, baseHumidity)),
      windSpeed: Math.max(0, Math.min(80, baseWindSpeed)),
      precipitation: Math.max(0, Math.min(100, basePrecipitation)),
      timestamp: date.toISOString()
    });
  }
  
  return data.reverse(); // Ordem cronológica
};

const calculateIAA = (weatherData: WeatherData[], activity: Activity): number => {
  if (weatherData.length === 0) return 0;
  
  const scores = weatherData.map(data => {
    const conditions = activity.optimalConditions;
    
    // Calcula pontuação para cada variável (0-100)
    const tempScore = calculateVariableScore(
      data.temperature, 
      conditions.temperature.min, 
      conditions.temperature.max
    );
    
    const humidityScore = calculateVariableScore(
      data.humidity, 
      conditions.humidity.min, 
      conditions.humidity.max
    );
    
    const windScore = calculateVariableScore(
      data.windSpeed, 
      conditions.windSpeed.min, 
      conditions.windSpeed.max
    );
    
    const precipitationScore = calculateVariableScore(
      data.precipitation, 
      conditions.precipitation.min, 
      conditions.precipitation.max
    );
    
    // Média ponderada (temperatura e precipitação têm mais peso)
    return (tempScore * 0.3 + humidityScore * 0.2 + windScore * 0.2 + precipitationScore * 0.3);
  });
  
  // Média dos últimos dados com peso maior para dados mais recentes
  const weightedAverage = scores.reduce((acc, score, index) => {
    const weight = (index + 1) / scores.length; // Pesos crescentes
    return acc + (score * weight);
  }, 0) / scores.reduce((acc, _, index) => acc + (index + 1) / scores.length, 0);
  
  return Math.round(weightedAverage);
};

const calculateVariableScore = (value: number, min: number, max: number): number => {
  if (value >= min && value <= max) {
    return 100; // Valor ideal
  } else if (value < min) {
    const distance = min - value;
    const range = max - min;
    return Math.max(0, 100 - (distance / range) * 100);
  } else {
    const distance = value - max;
    const range = max - min;
    return Math.max(0, 100 - (distance / range) * 100);
  }
};

const getIAALevel = (score: number): { label: string; color: string; icon: React.ElementType } => {
  if (score >= 80) return { label: 'Excelente', color: 'text-green-400', icon: CheckCircle };
  if (score >= 60) return { label: 'Bom', color: 'text-blue-400', icon: TrendingUp };
  if (score >= 40) return { label: 'Regular', color: 'text-yellow-400', icon: Minus };
  if (score >= 20) return { label: 'Ruim', color: 'text-orange-400', icon: TrendingDown };
  return { label: 'Péssimo', color: 'text-red-400', icon: XCircle };
};

const ActivitySuitabilityIndex = ({ location, activity, dateRange }: IAACalculationProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [iaa, setIAA] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  const generateData = () => {
    if (!location || !activity) return;
    
    setIsLoading(true);
    
    // Simula delay da API da NASA
    setTimeout(() => {
      const data = generateHistoricalData(location.lat, location.lng, 30);
      setWeatherData(data);
      
      const currentIAA = calculateIAA(data, activity);
      const previousIAA = calculateIAA(data.slice(0, -7), activity); // Últimos 7 dias
      
      setIAA(currentIAA);
      
      if (currentIAA > previousIAA + 5) setTrend('up');
      else if (currentIAA < previousIAA - 5) setTrend('down');
      else setTrend('stable');
      
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateData();
  }, [location, activity]);

  if (!location || !activity) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Índice de Adequação de Atividade (IAA)
          </CardTitle>
          <CardDescription>
            Selecione uma localização e atividade para calcular o IAA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mr-2" />
            Aguardando seleção de localização e atividade
          </div>
        </CardContent>
      </Card>
    );
  }

  const iaaLevel = getIAALevel(iaa);
  const IconComponent = iaaLevel.icon;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Índice de Adequação de Atividade (IAA)
        </CardTitle>
        <CardDescription>
          Baseado em dados históricos da NASA para {activity.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header com localização e atividade */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {location.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Últimos 30 dias
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* IAA Principal */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-6xl font-bold text-foreground">
                  {iaa}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <IconComponent className={`h-5 w-5 ${iaaLevel.color}`} />
                  <Badge variant="secondary" className={`${iaaLevel.color} bg-secondary/50`}>
                    {iaaLevel.label}
                  </Badge>
                  <TrendIcon className={`h-4 w-4 ${
                    trend === 'up' ? 'text-green-400' : 
                    trend === 'down' ? 'text-red-400' : 
                    'text-muted-foreground'
                  }`} />
                </div>
              </div>
              
              <Progress value={iaa} className="w-full" />
            </div>

            {/* Detalhes das condições */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Condições Atuais (Média 7 dias)</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Temperatura: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.temperature, 0) / 7)}°C</div>
                  <div>• Umidade: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.humidity, 0) / 7)}%</div>
                  <div>• Vento: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.windSpeed, 0) / 7)} km/h</div>
                  <div>• Chuva: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.precipitation, 0) / 7)} mm</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recomendação</h4>
                <p className="text-sm text-muted-foreground">
                  {iaa >= 80 && "Condições ideais! Excelente momento para a atividade."}
                  {iaa >= 60 && iaa < 80 && "Boas condições. Atividade recomendada com precauções básicas."}
                  {iaa >= 40 && iaa < 60 && "Condições moderadas. Considere ajustar o horário ou equipamentos."}
                  {iaa >= 20 && iaa < 40 && "Condições desfavoráveis. Atividade não recomendada para iniciantes."}
                  {iaa < 20 && "Condições ruins. Recomenda-se evitar a atividade."}
                </p>
              </div>
            </div>

            {/* Tendência */}
            <div className="p-3 bg-data-gradient rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <TrendIcon className={`h-4 w-4 ${
                  trend === 'up' ? 'text-green-400' : 
                  trend === 'down' ? 'text-red-400' : 
                  'text-muted-foreground'
                }`} />
                <span className="font-medium text-foreground">
                  {trend === 'up' && "Tendência de melhora nas condições"}
                  {trend === 'down' && "Tendência de piora nas condições"}
                  {trend === 'stable' && "Condições estáveis"}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySuitabilityIndex;