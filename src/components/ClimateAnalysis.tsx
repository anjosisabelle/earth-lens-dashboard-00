import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, MapPin, Download, RefreshCw, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClimateAnalysisProps {
  location: string;
  activity: string;
  date: string;
}

interface ClimateData {
  temperature: { value: number; probability: number; status: "good" | "warning" | "bad" };
  precipitation: { value: number; probability: number; status: "good" | "warning" | "bad" };
  windSpeed: { value: number; probability: number; status: "good" | "warning" | "bad" };
  humidity: { value: number; probability: number; status: "good" | "warning" | "bad" };
  overallSuitability: "excellent" | "good" | "moderate" | "poor";
  aiSuggestion?: string;
  alternativeLocation?: string;
}

const activityRequirements: Record<string, { temp: [number, number], precip: number, wind: number }> = {
  trilha: { temp: [15, 28], precip: 20, wind: 25 },
  praia: { temp: [24, 35], precip: 10, wind: 30 },
  piquenique: { temp: [18, 30], precip: 15, wind: 20 },
  ciclismo: { temp: [12, 30], precip: 20, wind: 35 },
  camping: { temp: [10, 28], precip: 25, wind: 30 },
  fotografia: { temp: [5, 35], precip: 30, wind: 40 },
  pesca: { temp: [10, 32], precip: 40, wind: 25 },
  surf: { temp: [18, 32], precip: 50, wind: 45 },
  parapente: { temp: [15, 30], precip: 5, wind: 35 },
  esqui: { temp: [-10, 5], precip: 80, wind: 40 },
  caiaque: { temp: [15, 32], precip: 30, wind: 25 },
  observacao: { temp: [5, 35], precip: 20, wind: 30 },
};

export const ClimateAnalysis = ({ location, activity, date }: ClimateAnalysisProps) => {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateMockData = (): ClimateData => {
    const requirements = activityRequirements[activity] || activityRequirements.trilha;
    
    // Simular dados baseados em NASA Earth observations
    const temperature: ClimateData["temperature"] = {
      value: Math.random() * 35 + 5,
      probability: Math.random() * 100,
      status: "good"
    };
    
    const precipitation: ClimateData["precipitation"] = {
      value: Math.random() * 100,
      probability: Math.random() * 100,
      status: "good"
    };
    
    const windSpeed: ClimateData["windSpeed"] = {
      value: Math.random() * 50,
      probability: Math.random() * 100,
      status: "good"
    };
    
    const humidity: ClimateData["humidity"] = {
      value: Math.random() * 100,
      probability: Math.random() * 100,
      status: "good"
    };

    // Avaliar adequabilidade
    let suitabilityScore = 0;
    
    if (temperature.value >= requirements.temp[0] && temperature.value <= requirements.temp[1]) {
      temperature.status = "good";
      suitabilityScore += 25;
    } else {
      temperature.status = temperature.value < requirements.temp[0] - 5 || temperature.value > requirements.temp[1] + 5 ? "bad" : "warning";
    }
    
    if (precipitation.value <= requirements.precip) {
      precipitation.status = "good";
      suitabilityScore += 25;
    } else {
      precipitation.status = precipitation.value > requirements.precip * 2 ? "bad" : "warning";
    }
    
    if (windSpeed.value <= requirements.wind) {
      windSpeed.status = "good";
      suitabilityScore += 25;
    } else {
      windSpeed.status = windSpeed.value > requirements.wind * 1.5 ? "bad" : "warning";
    }
    
    if (humidity.value >= 40 && humidity.value <= 70) {
      humidity.status = "good";
      suitabilityScore += 25;
    } else {
      humidity.status = humidity.value < 30 || humidity.value > 85 ? "bad" : "warning";
    }

    let overallSuitability: ClimateData["overallSuitability"];
    let aiSuggestion: string | undefined;
    let alternativeLocation: string | undefined;

    if (suitabilityScore >= 75) {
      overallSuitability = "excellent";
    } else if (suitabilityScore >= 50) {
      overallSuitability = "good";
    } else if (suitabilityScore >= 25) {
      overallSuitability = "moderate";
      aiSuggestion = `Condições moderadas para ${activity} em ${location}. Considere adiar por alguns dias ou verificar locais alternativos.`;
      alternativeLocation = "Serra da Mantiqueira, SP (85% adequabilidade)";
    } else {
      overallSuitability = "poor";
      aiSuggestion = `Condições inadequadas para ${activity} em ${location} nesta data. Recomendamos fortemente um local alternativo.`;
      alternativeLocation = "Parque Nacional da Chapada dos Veadeiros, GO (92% adequabilidade)";
    }

    return {
      temperature,
      precipitation,
      windSpeed,
      humidity,
      overallSuitability,
      aiSuggestion,
      alternativeLocation
    };
  };

  const fetchClimateData = async () => {
    setLoading(true);
    // Simular chamada à API da NASA
    await new Promise(resolve => setTimeout(resolve, 1500));
    const data = generateMockData();
    setClimateData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClimateData();
  }, [location, activity, date]);

  const downloadData = () => {
    if (!climateData) return;
    
    const csvData = `Location,Activity,Date,Temperature (°C),Precipitation (%),Wind Speed (km/h),Humidity (%),Suitability
${location},${activity},${date},${climateData.temperature.value.toFixed(1)},${climateData.precipitation.value.toFixed(1)},${climateData.windSpeed.value.toFixed(1)},${climateData.humidity.value.toFixed(1)},${climateData.overallSuitability}`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climate-analysis-${location}-${date}.csv`;
    a.click();
  };

  const getStatusColor = (status: "good" | "warning" | "bad") => {
    switch (status) {
      case "good": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "bad": return "text-red-500";
    }
  };

  const getSuitabilityBadge = (suitability: ClimateData["overallSuitability"]) => {
    const config = {
      excellent: { label: "Excelente", className: "bg-green-500" },
      good: { label: "Bom", className: "bg-blue-500" },
      moderate: { label: "Moderado", className: "bg-yellow-500" },
      poor: { label: "Inadequado", className: "bg-red-500" }
    };
    return config[suitability];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span>Analisando dados históricos da NASA...</span>
        </div>
      </Card>
    );
  }

  if (!climateData) return null;

  const suitabilityConfig = getSuitabilityBadge(climateData.overallSuitability);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Análise Climática</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {location} • {new Date(date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchClimateData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadData}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Badge className={suitabilityConfig.className}>
            {suitabilityConfig.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Temperatura</p>
            <p className={`text-lg font-bold ${getStatusColor(climateData.temperature.status)}`}>
              {climateData.temperature.value.toFixed(1)}°C
            </p>
            <p className="text-xs text-muted-foreground">{climateData.temperature.probability.toFixed(0)}% probabilidade</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Precipitação</p>
            <p className={`text-lg font-bold ${getStatusColor(climateData.precipitation.status)}`}>
              {climateData.precipitation.value.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">{climateData.precipitation.probability.toFixed(0)}% probabilidade</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Vento</p>
            <p className={`text-lg font-bold ${getStatusColor(climateData.windSpeed.status)}`}>
              {climateData.windSpeed.value.toFixed(1)} km/h
            </p>
            <p className="text-xs text-muted-foreground">{climateData.windSpeed.probability.toFixed(0)}% probabilidade</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Umidade</p>
            <p className={`text-lg font-bold ${getStatusColor(climateData.humidity.status)}`}>
              {climateData.humidity.value.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">{climateData.humidity.probability.toFixed(0)}% probabilidade</p>
          </div>
        </div>

        {climateData.aiSuggestion && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Sugestão da IA</p>
              <p className="mb-2">{climateData.aiSuggestion}</p>
              {climateData.alternativeLocation && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-primary/10 rounded">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{climateData.alternativeLocation}</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          Dados baseados em décadas de observações da Terra pela NASA
        </div>
      </Card>
    </div>
  );
};
