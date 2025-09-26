import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Download, 
  TrendingUp, 
  Cloud, 
  Thermometer, 
  Wind, 
  Droplets,
  Eye,
  Settings
} from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import DataVisualization from "@/components/DataVisualization";
import ClimateFilters from "@/components/ClimateFilters";
import ActivitySelector, { Activity } from "@/components/ActivitySelector";
import ActivitySuitabilityIndex from "@/components/ActivitySuitabilityIndex";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['temperature']);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });

  const handleDownloadData = (format: 'csv' | 'json') => {
    // Placeholder para funcionalidade de download
    console.log(`Downloading data in ${format} format for:`, {
      location: selectedLocation,
      variables: selectedVariables,
      dateRange
    });
  };

  return (
    <div className="min-h-screen bg-space-gradient">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-md bg-background/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-atmosphere-gradient"></div>
              <h1 className="text-xl font-bold text-foreground">NASA Earth Observer</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Dashboard Ativo
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Status e Localização */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Seleção de Localização
              </CardTitle>
              <CardDescription>
                Escolha a localização para análise de dados climáticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationSelector 
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Período Temporal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Data Final</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                  className="bg-input/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de Variáveis Climáticas */}
        <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Variáveis Climáticas
            </CardTitle>
            <CardDescription>
              Selecione as variáveis ambientais para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClimateFilters
              selectedVariables={selectedVariables}
              onVariablesChange={setSelectedVariables}
            />
          </CardContent>
        </Card>

        {/* Índice de Adequação de Atividade (IAA) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivitySelector
            selectedActivity={selectedActivity}
            onActivitySelect={setSelectedActivity}
          />
          <ActivitySuitabilityIndex
            location={selectedLocation}
            activity={selectedActivity}
            dateRange={dateRange}
          />
        </div>

        {/* Visualizações */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/50 backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="iaa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              IAA Detalhado
            </TabsTrigger>
            <TabsTrigger value="probability" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Probabilidades
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tendências
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Exportar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DataVisualization
              location={selectedLocation}
              variables={selectedVariables}
              dateRange={dateRange}
              type="overview"
            />
          </TabsContent>

          <TabsContent value="iaa" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ActivitySuitabilityIndex
                location={selectedLocation}
                activity={selectedActivity}
                dateRange={dateRange}
              />
              {selectedActivity && (
                <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Análise Detalhada - {selectedActivity.name}
                    </CardTitle>
                    <CardDescription>
                      Histórico de adequação e recomendações personalizadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-data-gradient rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2 text-foreground">Sobre o IAA:</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          O Índice de Adequação de Atividade (IAA) é calculado com base em dados históricos 
                          da NASA, considerando temperatura, umidade, velocidade do vento e precipitação. 
                          O índice varia de 0-100, onde valores mais altos indicam melhores condições.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-green-400">80-100:</strong> Condições excelentes
                          </div>
                          <div>
                            <strong className="text-blue-400">60-79:</strong> Condições boas
                          </div>
                          <div>
                            <strong className="text-yellow-400">40-59:</strong> Condições regulares
                          </div>
                          <div>
                            <strong className="text-red-400">0-39:</strong> Condições desfavoráveis
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="probability" className="space-y-6">
            <DataVisualization
              location={selectedLocation}
              variables={selectedVariables}
              dateRange={dateRange}
              type="probability"
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <DataVisualization
              location={selectedLocation}
              variables={selectedVariables}
              dateRange={dateRange}
              type="trends"
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Exportar Dados
                </CardTitle>
                <CardDescription>
                  Baixe os dados selecionados em diferentes formatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="space" 
                    onClick={() => handleDownloadData('csv')}
                    disabled={!selectedLocation}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Download CSV
                    <span className="text-xs opacity-80">Formato de planilha</span>
                  </Button>
                  <Button 
                    variant="space" 
                    onClick={() => handleDownloadData('json')}
                    disabled={!selectedLocation}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Download JSON
                    <span className="text-xs opacity-80">Formato de dados estruturados</span>
                  </Button>
                </div>
                
                {selectedLocation && (
                  <div className="p-4 bg-data-gradient rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 text-foreground">Resumo da Exportação:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Localização: {selectedLocation.name}</li>
                      <li>• Variáveis: {selectedVariables.join(', ')}</li>
                      <li>• Período: {dateRange.start || 'Não definido'} - {dateRange.end || 'Não definido'}</li>
                      <li>• Metadados incluídos: Unidades, fontes, timestamps</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;