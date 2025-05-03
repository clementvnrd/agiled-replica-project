
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Database, FileText, Network } from 'lucide-react';

const DashboardSystemCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <Card className="h-full hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Database size={18} className="text-blue-600" />
              Système RAG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-4 flex flex-col items-center text-agiled-lightText">
              <FileText size={32} className="mb-3 text-blue-500" />
              <p className="mb-4 text-center">Gérez votre base de connaissances pour améliorer les capacités de vos agents IA.</p>
              <Link to="/rag" className="btn-primary">
                Gérer les documents RAG
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Network size={18} className="text-indigo-600" />
              Connecteurs MCP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-4 flex flex-col items-center text-agiled-lightText">
              <Network size={32} className="mb-3 text-indigo-500" />
              <p className="mb-4 text-center">Connectez vos outils externes via MCP pour enrichir votre système.</p>
              <Link to="/mcp" className="btn-primary">
                Ajouter connecteur
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSystemCards;
