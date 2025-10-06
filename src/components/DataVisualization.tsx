import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Calendar,
  MapPin,
  Activity,
  Gauge
} from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface DataVisualizationProps {
  location: Location | null;
  variables: string[];
  dateRange: { start: string; end: string };
  type: 'overview' | 'probability' | 'trends';
}

// Dados simulados para demonstração
const generateMockData = (variables: string[], type: string) => {
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    const baseData: any = {
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
    };

    variables.forEach(variable => {
      switch (variable) {
        case 'temperature':
          baseData[variable] = 20 + Math.sin(i / 5) * 8 + Math.random() * 4;
          break;
        case 'precipitation':
          baseData[variable] = Math.random() * 20;
          break;
        case 'wind_speed':
          baseData[variable] = 5 + Math.random() * 15;
          break;
        case 'humidity':
          baseData[variable] = 40 + Math.random() * 40;
          break;
        default:
          baseData[variable] = Math.random() * 100;
      }
    });

    return baseData;
  });

  return timeSeriesData;
};

const probabilityData = [
  { name: 'Very Low', value: 15, fill: '#10B981' },
  { name: 'Low', value: 25, fill: '#3B82F6' },
  { name: 'Moderate', value: 35, fill: '#F59E0B' },
  { name: 'High', value: 20, fill: '#EF4444' },
  { name: 'Extreme', value: 5, fill: '#7C2D12' },
];

const variableNames: Record<string, string> = {
  temperature: 'Temperature',
  precipitation: 'Precipitation',
  wind_speed: 'Wind Speed',
  humidity: 'Relative Humidity',
  visibility: 'Visibility',
  solar_radiation: 'Solar Radiation',
  cloud_cover: 'Cloud Cover',
  pressure: 'Atmospheric Pressure',
  air_quality: 'Air Quality'
};

const variableUnits: Record<string, string> = {
  temperature: '°C',
  precipitation: 'mm',
  wind_speed: 'm/s',
  humidity: '%',
  visibility: 'km',
  solar_radiation: 'W/m²',
  cloud_cover: '%',
  pressure: 'hPa',
  air_quality: 'AQI'
};

const getVariableColor = (variable: string) => {
  const colors: Record<string, string> = {
    temperature: '#EF4444',
    precipitation: '#3B82F6',
    wind_speed: '#10B981',
    humidity: '#8B5CF6',
    visibility: '#F59E0B',
    solar_radiation: '#F97316',
    cloud_cover: '#6B7280',
    pressure: '#EC4899',
    air_quality: '#14B8A6'
  };
  return colors[variable] || '#6B7280';
};

const DataVisualization = ({ location, variables, dateRange, type }: DataVisualizationProps) => {
  const data = generateMockData(variables, type);

  if (!location) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
        <CardContent className="p-12 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Select a Location</h3>
          <p className="text-muted-foreground">
            Choose a location to view climate data
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variables.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Select Variables</h3>
          <p className="text-muted-foreground">
            Choose at least one climate variable for analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Resumo da Localização */}
      <Card className="bg-data-gradient border-primary/30">
        <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Analysis for {location.name}
            </CardTitle>
            <CardDescription>
              Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="bg-primary/20 text-primary mb-2">
                Active Variables
              </Badge>
              <p className="text-2xl font-bold text-foreground">{variables.length}</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-accent/20 text-accent mb-2">
                Analysis Period
              </Badge>
              <p className="text-sm text-muted-foreground">
                {dateRange.start || 'Not set'} - {dateRange.end || 'Not set'}
              </p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-secondary/50 mb-2">
                Status
              </Badge>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm text-accent">Data Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos por Variável */}
      {variables.map(variable => (
        <Card key={variable} className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{variableNames[variable] || variable}</span>
              <Badge variant="outline" className="bg-background/50">
                {variableUnits[variable]}
              </Badge>
            </CardTitle>
            <CardDescription>
              Time series from the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={variable}
                  stroke={getVariableColor(variable)}
                  fill={`${getVariableColor(variable)}40`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderProbability = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Probability Distribution
            </CardTitle>
            <CardDescription>
              Probability of extreme conditions for {location.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={probabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {probabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
          <CardHeader>
            <CardTitle>Alerts and Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">High Risk</h4>
                <p className="text-sm text-muted-foreground">
                  25% chance of extreme conditions in the next 7 days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary mb-1">Information</h4>
                <p className="text-sm text-muted-foreground">
                  Ideal conditions for outdoor activities: 60% probability
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold text-accent mb-1">Stable</h4>
                <p className="text-sm text-muted-foreground">
                  Stable weather conditions expected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trend Analysis
            </CardTitle>
            <CardDescription>
              Temporal comparison of selected variables
            </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              {variables.map(variable => (
                <Line
                  key={variable}
                  type="monotone"
                  dataKey={variable}
                  stroke={getVariableColor(variable)}
                  strokeWidth={2}
                  dot={{ fill: getVariableColor(variable), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {variables.map(variable => (
              <Badge 
                key={variable}
                variant="outline" 
                className="bg-background/50"
                style={{ 
                  borderColor: getVariableColor(variable),
                  color: getVariableColor(variable)
                }}
              >
                {variableNames[variable]} ({variableUnits[variable]})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {variables.slice(0, 4).map(variable => {
          const values = data.map(d => d[variable]).filter(Boolean);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);
          
          return (
            <Card key={variable} className="bg-card/30 backdrop-blur-sm border-border/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">
                  {variableNames[variable]}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average:</span>
                    <span className="font-medium">{avg.toFixed(1)} {variableUnits[variable]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maximum:</span>
                    <span className="font-medium">{max.toFixed(1)} {variableUnits[variable]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum:</span>
                    <span className="font-medium">{min.toFixed(1)} {variableUnits[variable]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  switch (type) {
    case 'overview':
      return renderOverview();
    case 'probability':
      return renderProbability();
    case 'trends':
      return renderTrends();
    default:
      return renderOverview();
  }
};

export default DataVisualization;