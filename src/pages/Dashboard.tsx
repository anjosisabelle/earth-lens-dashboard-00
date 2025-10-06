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
    // Placeholder for download functionality
    console.log(`Downloading data in ${format} format for:`, {
      location: selectedLocation,
      variables: selectedVariables,
      dateRange
    });
  };

  const handleZoomToLocation = (location: { lat: number; lng: number; name: string }) => {
    // This could be used if Dashboard has a map view in the future
    console.log("Zoom to location:", location);
  };

  return (
    <div className="min-h-screen bg-space-gradient">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-md bg-background/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-atmosphere-gradient"></div>
              <h1 className="text-xl font-bold text-foreground">ClimaCerto</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Active Dashboard
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Status and Location */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location Selection
              </CardTitle>
              <CardDescription>
                Choose the location for climate data analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationSelector 
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
                onZoomToLocation={handleZoomToLocation}
              />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Time Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
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

        {/* Climate Variables Filters */}
        <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-data-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Climate Variables
            </CardTitle>
            <CardDescription>
              Select environmental variables for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClimateFilters
              selectedVariables={selectedVariables}
              onVariablesChange={setSelectedVariables}
            />
          </CardContent>
        </Card>

        {/* Activity Suitability Index (ASI) */}
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

        {/* Visualizations */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/50 backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="iaa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Detailed ASI
            </TabsTrigger>
            <TabsTrigger value="probability" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Probabilities
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Trends
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Export
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
                      Detailed Analysis - {selectedActivity.name}
                    </CardTitle>
                    <CardDescription>
                      Suitability history and personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-data-gradient rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2 text-foreground">About ASI:</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          The Activity Suitability Index (ASI) is calculated based on NASA historical data, 
                          considering temperature, humidity, wind speed, and precipitation. 
                          The index ranges from 0-100, where higher values indicate better conditions.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-green-400">80-100:</strong> Excellent conditions
                          </div>
                          <div>
                            <strong className="text-blue-400">60-79:</strong> Good conditions
                          </div>
                          <div>
                            <strong className="text-yellow-400">40-59:</strong> Fair conditions
                          </div>
                          <div>
                            <strong className="text-red-400">0-39:</strong> Unfavorable conditions
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
                  Export Data
                </CardTitle>
                <CardDescription>
                  Download selected data in different formats
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
                    <span className="text-xs opacity-80">Spreadsheet format</span>
                  </Button>
                  <Button 
                    variant="space" 
                    onClick={() => handleDownloadData('json')}
                    disabled={!selectedLocation}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Download JSON
                    <span className="text-xs opacity-80">Structured data format</span>
                  </Button>
                </div>
                
                {selectedLocation && (
                  <div className="p-4 bg-data-gradient rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 text-foreground">Export Summary:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Location: {selectedLocation.name}</li>
                      <li>• Variables: {selectedVariables.join(', ')}</li>
                      <li>• Period: {dateRange.start || 'Not set'} - {dateRange.end || 'Not set'}</li>
                      <li>• Metadata included: Units, sources, timestamps</li>
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
