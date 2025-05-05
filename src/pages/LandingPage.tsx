
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Agiled Replica</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-blue-700 hover:text-blue-800"
          >
            Se connecter
          </Button>
          <Button 
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            S'inscrire
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto flex flex-col md:flex-row items-center justify-between py-12 px-4">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Une plateforme complète pour gérer tous vos projets
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Gérez vos clients, vos projets, votre facturation et vos équipes dans une seule application, alimentée par l'IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              size="lg"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6"
              size="lg"
            >
              Se connecter
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <img 
                src="/placeholder.svg" 
                alt="Dashboard preview" 
                className="w-full object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold text-center mb-10">Fonctionnalités principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'CRM Intégré', 
              description: 'Gérez vos clients, contacts et opportunités en un seul endroit.' 
            },
            { 
              title: 'Gestion Financière', 
              description: 'Factures, devis et suivi des paiements pour une gestion complète.' 
            },
            { 
              title: 'Assistant IA', 
              description: 'Un assistant virtuel pour vous aider dans toutes vos tâches quotidiennes.' 
            }
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2025 Agiled Replica. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
