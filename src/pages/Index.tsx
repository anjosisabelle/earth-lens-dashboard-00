import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Globe, Satellite, BarChart3, Download, MapPin, Cloud, Thermometer, Wind } from "lucide-react";
import earthHero from "@/assets/earth-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-space-gradient">
      {/* Navigation */}
      <nav className="border-b border-border/20 backdrop-blur-md bg-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Satellite className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">NASA Earth Observer</h1>
            </div>
            <Link to="/dashboard">
              <Button variant="space">Iniciar Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={earthHero} 
            alt="Vista da Terra do espaço com atmosfera brilhante"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-space-gradient opacity-80"></div>
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-atmosphere-gradient bg-clip-text text-transparent">
            Observação da Terra NASA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Crie painéis personalizados para analisar probabilidades climáticas usando dados de observação da Terra da NASA. 
            Explore temperatura, precipitação, qualidade do ar e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                <Globe className="mr-2 h-6 w-6" />
                Explorar Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              <BarChart3 className="mr-2 h-6 w-6" />
              Ver Exemplos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Funcionalidades Principais
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Ferramentas avançadas para análise de dados climáticos e ambientais da NASA
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Seleção Interativa de Localização</h3>
              <p className="text-muted-foreground">
                Escolha localizações através de mapas interativos, coordenadas ou busca por nome de cidade.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <Cloud className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Variáveis Climáticas Completas</h3>
              <p className="text-muted-foreground">
                Analise precipitação, temperatura, qualidade do ar, velocidade do vento e outros parâmetros ambientais.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Análises Probabilísticas</h3>
              <p className="text-muted-foreground">
                Visualize probabilidades de condições extremas e tendências climáticas ao longo do tempo.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <Thermometer className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Monitoramento Temporal</h3>
              <p className="text-muted-foreground">
                Selecione períodos específicos do ano para análises sazonais e comparações históricas.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <Wind className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Visualizações Avançadas</h3>
              <p className="text-muted-foreground">
                Gráficos interativos, mapas de calor e representações visuais intuitivas dos dados climáticos.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-md border-border/20 shadow-data-card hover:shadow-atmospheric transition-smooth">
              <Download className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Exportação de Dados</h3>
              <p className="text-muted-foreground">
                Baixe dados em formatos CSV e JSON com metadados completos e links para fontes originais.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-data-gradient">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Pronto para Explorar os Dados da Terra?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece a criar seus painéis personalizados e descubra insights sobre as condições climáticas do nosso planeta.
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="xl">
              <Satellite className="mr-2 h-6 w-6" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-background/10 backdrop-blur-md py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Dados fornecidos pela NASA Earth Observation System Data and Information System (EOSDIS)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;