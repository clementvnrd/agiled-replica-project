
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Mic, 
  Code, 
  Globe, 
  Smartphone, 
  Users, 
  Database,
  Lightbulb,
  Rocket
} from 'lucide-react';

const SUGGESTED_FEATURES = [
  {
    title: 'Import de documents',
    description: 'Analysez vos PDF, Word, et autres documents',
    icon: <FileText className="w-5 h-5" />,
    priority: 'high',
    category: 'RAG'
  },
  {
    title: 'Vision multimodale',
    description: 'Analysez et décrivez vos images',
    icon: <Image className="w-5 h-5" />,
    priority: 'high',
    category: 'AI'
  },
  {
    title: 'Reconnaissance vocale',
    description: 'Dictez vos messages au lieu de les taper',
    icon: <Mic className="w-5 h-5" />,
    priority: 'medium',
    category: 'UX'
  },
  {
    title: 'Génération de code',
    description: 'Templates et snippets de code personnalisés',
    icon: <Code className="w-5 h-5" />,
    priority: 'medium',
    category: 'Dev'
  },
  {
    title: 'Navigation web',
    description: 'Recherche et analyse de sites web en temps réel',
    icon: <Globe className="w-5 h-5" />,
    priority: 'low',
    category: 'MCP'
  },
  {
    title: 'App mobile',
    description: 'Interface mobile native pour vos conversations',
    icon: <Smartphone className="w-5 h-5" />,
    priority: 'low',
    category: 'Platform'
  },
  {
    title: 'Sessions collaboratives',
    description: 'Partagez vos conversations avec votre équipe',
    icon: <Users className="w-5 h-5" />,
    priority: 'medium',
    category: 'Business'
  },
  {
    title: 'Base de connaissances',
    description: 'Connectez vos données d\'entreprise',
    icon: <Database className="w-5 h-5" />,
    priority: 'high',
    category: 'Business'
  }
];

const FeatureSuggestions: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return 'bg-purple-100 text-purple-800';
      case 'RAG': return 'bg-blue-100 text-blue-800';
      case 'UX': return 'bg-pink-100 text-pink-800';
      case 'Dev': return 'bg-indigo-100 text-indigo-800';
      case 'MCP': return 'bg-orange-100 text-orange-800';
      case 'Platform': return 'bg-teal-100 text-teal-800';
      case 'Business': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Fonctionnalités suggérées</h3>
          <p className="text-sm text-gray-600">Améliorez votre expérience LLM</p>
        </div>
      </div>

      <div className="space-y-4">
        {SUGGESTED_FEATURES.map((feature, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <Badge className={`text-xs ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(feature.category)}`}>
                      {feature.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-4">
                <Rocket className="w-3 h-3 mr-1" />
                Voter
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Suggérer une fonctionnalité</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          Vous avez une idée pour améliorer l'interface ? Partagez-la avec nous !
        </p>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Proposer une idée
        </Button>
      </div>
    </Card>
  );
};

export default FeatureSuggestions;
