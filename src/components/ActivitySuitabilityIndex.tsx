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

interface ASICalculationProps {
  location: { lat: number; lng: number; name: string } | null;
  activity: Activity | null;
  dateRange: { start: string; end: string };
}

// Simulates NASA historical data based on location
const generateHistoricalData = (lat: number, lng: number, days: number = 30): WeatherData[] => {
  const data: WeatherData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    
    // Simulate variations based on latitude (simple climate approximation)
    const latFactor = Math.abs(lat) / 90; // 0-1 where 1 is pole
    const seasonFactor = Math.sin((date.getMonth() * Math.PI) / 6); // Seasonal variation
    
    // Base temperature adjusted by latitude and longitude
    const baseTemp = (30 - (latFactor * 40)) + (seasonFactor * 10) + (Math.random() - 0.5) * 15;
    
    // Base humidity (coasts have more humidity)
    const coastalFactor = Math.sin(lng * Math.PI / 180) * 0.3;
    const baseHumidity = 50 + (coastalFactor * 30) + (Math.random() * 40);
    
    // Wind speed
    const baseWindSpeed = 5 + (latFactor * 15) + (Math.random() * 20);
    
    // Precipitation (more common at certain latitudes)
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
  
  return data.reverse(); // Chronological order
};

const calculateASI = (weatherData: WeatherData[], activity: Activity): number => {
  if (weatherData.length === 0) return 0;
  
  const scores = weatherData.map(data => {
    const conditions = activity.optimalConditions;
    
    // Calculate score for each variable (0-100)
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
    
    // Weighted average (temperature and precipitation have more weight)
    return (tempScore * 0.3 + humidityScore * 0.2 + windScore * 0.2 + precipitationScore * 0.3);
  });
  
  // Average of recent data with higher weight for more recent data
  const weightedAverage = scores.reduce((acc, score, index) => {
    const weight = (index + 1) / scores.length; // Increasing weights
    return acc + (score * weight);
  }, 0) / scores.reduce((acc, _, index) => acc + (index + 1) / scores.length, 0);
  
  return Math.round(weightedAverage);
};

const calculateVariableScore = (value: number, min: number, max: number): number => {
  if (value >= min && value <= max) {
    return 100; // Ideal value
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

const getASILevel = (score: number): { label: string; color: string; icon: React.ElementType } => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-400', icon: CheckCircle };
  if (score >= 60) return { label: 'Good', color: 'text-blue-400', icon: TrendingUp };
  if (score >= 40) return { label: 'Fair', color: 'text-yellow-400', icon: Minus };
  if (score >= 20) return { label: 'Poor', color: 'text-orange-400', icon: TrendingDown };
  return { label: 'Very Poor', color: 'text-red-400', icon: XCircle };
};

const ActivitySuitabilityIndex = ({ location, activity, dateRange }: ASICalculationProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [asi, setASI] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  const generateData = () => {
    if (!location || !activity) return;
    
    setIsLoading(true);
    
    // Simulate NASA API delay
    setTimeout(() => {
      const data = generateHistoricalData(location.lat, location.lng, 30);
      setWeatherData(data);
      
      const currentASI = calculateASI(data, activity);
      const previousASI = calculateASI(data.slice(0, -7), activity); // Last 7 days
      
      setASI(currentASI);
      
      if (currentASI > previousASI + 5) setTrend('up');
      else if (currentASI < previousASI - 5) setTrend('down');
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
            Activity Suitability Index (ASI)
          </CardTitle>
          <CardDescription>
            Select a location and activity to calculate the ASI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mr-2" />
            Waiting for location and activity selection
          </div>
        </CardContent>
      </Card>
    );
  }

  const asiLevel = getASILevel(asi);
  const IconComponent = asiLevel.icon;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Activity Suitability Index (ASI)
        </CardTitle>
        <CardDescription>
          Based on NASA historical data for {activity.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header with location and activity */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {location.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Last 30 days
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
            {/* Main ASI */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-6xl font-bold text-foreground">
                  {asi}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <IconComponent className={`h-5 w-5 ${asiLevel.color}`} />
                  <Badge variant="secondary" className={`${asiLevel.color} bg-secondary/50`}>
                    {asiLevel.label}
                  </Badge>
                  <TrendIcon className={`h-4 w-4 ${
                    trend === 'up' ? 'text-green-400' : 
                    trend === 'down' ? 'text-red-400' : 
                    'text-muted-foreground'
                  }`} />
                </div>
              </div>
              
              <Progress value={asi} className="w-full" />
            </div>

            {/* Condition details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Current Conditions (7-day avg)</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Temperature: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.temperature, 0) / 7)}°C</div>
                  <div>• Humidity: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.humidity, 0) / 7)}%</div>
                  <div>• Wind: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.windSpeed, 0) / 7)} km/h</div>
                  <div>• Rain: {Math.round(weatherData.slice(-7).reduce((acc, d) => acc + d.precipitation, 0) / 7)} mm</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  {asi >= 80 && "Ideal conditions! Excellent time for this activity."}
                  {asi >= 60 && asi < 80 && "Good conditions. Activity recommended with basic precautions."}
                  {asi >= 40 && asi < 60 && "Moderate conditions. Consider adjusting timing or equipment."}
                  {asi >= 20 && asi < 40 && "Unfavorable conditions. Activity not recommended for beginners."}
                  {asi < 20 && "Poor conditions. Recommend avoiding this activity."}
                </p>
              </div>
            </div>

            {/* Trend */}
            <div className="p-3 bg-data-gradient rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <TrendIcon className={`h-4 w-4 ${
                  trend === 'up' ? 'text-green-400' : 
                  trend === 'down' ? 'text-red-400' : 
                  'text-muted-foreground'
                }`} />
                <span className="font-medium text-foreground">
                  {trend === 'up' && "Conditions improving"}
                  {trend === 'down' && "Conditions worsening"}
                  {trend === 'stable' && "Stable conditions"}
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
