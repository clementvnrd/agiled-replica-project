
import React from 'react';
import { Plus, Calendar, CreditCard, ShoppingBag, Bot, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MCPCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected';
  url?: string;
}

const MCPCard: React.FC<MCPCardProps> = ({ title, description, icon, status, url }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <div className={`px-2 py-1 text-xs rounded-full ${
            status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'connected' ? 'Connecté' : 'Non connecté'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{description}</CardDescription>
        {url && (
          <div className="mt-2 text-sm text-agiled-lightText truncate">
            URL: {url}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <button className={`btn-${status === 'connected' ? 'outline' : 'primary'} w-full`}>
          {status === 'connected' ? 'Gérer' : 'Connecter'}
        </button>
      </CardFooter>
    </Card>
  );
};

const MCPManager: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">MCP Manager</h1>
        <p className="text-agiled-lightText">Gérez vos connecteurs Multi-Channel Provider pour intégrer vos outils externes</p>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
        <div className="flex items-start">
          <div className="text-blue-600 mt-1 mr-3">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">À propos des connecteurs MCP</h3>
            <p className="text-sm text-blue-700">
              Les connecteurs MCP (Multi-Channel Provider) vous permettent d'intégrer des outils et services externes à votre plateforme.
              Vous pouvez connecter des services comme Google Calendar, Stripe, Shopify, Strava, et bien d'autres pour centraliser toutes vos données.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <button className="btn-primary flex items-center">
          <Plus size={16} className="mr-1" /> Ajouter un MCP
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MCPCard 
          title="Google Calendar" 
          description="Synchronisez vos évènements et rendez-vous avec votre plateforme All-in-One."
          icon={<Calendar size={20} className="text-blue-600" />}
          status="disconnected"
        />
        
        <MCPCard 
          title="Stripe" 
          description="Intégrez vos données de paiement et transactions à votre tableau de bord financier."
          icon={<CreditCard size={20} className="text-purple-600" />}
          status="disconnected"
        />
        
        <MCPCard 
          title="Shopify" 
          description="Importez automatiquement les données de votre boutique pour le suivi commercial."
          icon={<ShoppingBag size={20} className="text-green-600" />}
          status="disconnected"
        />
        
        <MCPCard 
          title="OpenRouter" 
          description="Connectez OpenRouter pour alimenter votre Agent IA et augmenter ses capacités."
          icon={<Bot size={20} className="text-orange-600" />}
          status="disconnected"
        />
        
        <MCPCard 
          title="Strava" 
          description="Synchronisez vos activités sportives pour le suivi fitness et santé."
          icon={<Activity size={20} className="text-red-600" />}
          status="disconnected"
        />
      </div>
    </div>
  );
};

// Helper component for the Info icon
const Info = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="16" y2="12" />
    <line x1="12" x2="12.01" y1="8" y2="8" />
  </svg>
);

export default MCPManager;
