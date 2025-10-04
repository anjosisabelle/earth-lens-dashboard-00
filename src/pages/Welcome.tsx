import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Satellite, CloudRain, Wind, Thermometer, MapPin, TrendingUp } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Satellite,
      title: "Dados da NASA",
      description: "Utilizamos dados históricos de observação da Terra da NASA para análise precisa"
    },
    {
      icon: CloudRain,
      title: "Probabilidades Climáticas",
      description: "Calcule a probabilidade de condições adversas para seu local e data"
    },
    {
      icon: Wind,
      title: "Múltiplas Variáveis",
      description: "Analise temperatura, precipitação, vento, umidade e qualidade do ar"
    },
    {
      icon: MapPin,
      title: "Qualquer Localização",
      description: "Selecione qualquer ponto no mapa ou digite o nome do local"
    },
    {
      icon: TrendingUp,
      title: "Tendências Históricas",
      description: "Veja como as condições mudaram ao longo das décadas"
    },
    {
      icon: Thermometer,
      title: "Sugestões Inteligentes",
      description: "IA recomenda locais alternativos quando o clima não está ideal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-6">
            <Satellite className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            ClimaCerto
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Planejamento Inteligente de Atividades ao Ar Livre
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Desenvolvido com dados de observação da Terra da NASA para o Hackathon Brasil
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Começar Análise Climática
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* About Section */}
        <Card className="p-8 max-w-4xl mx-auto bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Sobre o Projeto</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              O ClimaCerto utiliza décadas de dados de observação da Terra da NASA para fornecer 
              informações sobre a probabilidade de condições climáticas específicas em qualquer 
              localização e época do ano.
            </p>
            <p>
              Diferente de previsões meteorológicas, nosso sistema analisa dados históricos para 
              determinar as chances de condições extremas como: calor intenso, frio extremo, 
              ventos fortes, chuvas intensas ou condições desconfortáveis.
            </p>
            <p className="font-semibold text-foreground">
              Planeje suas atividades ao ar livre com confiança, sabendo exatamente quais são 
              as probabilidades climáticas para o local e data escolhidos.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
