
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSystemCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Système RAG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6 text-center text-agiled-lightText">
              <p className="mb-4">Votre système de Retrieval Augmented Generation (RAG) n'est pas encore configuré.</p>
              <button className="btn-primary">Configurer RAG</button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Connecteurs MCP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6 text-center text-agiled-lightText">
              <p className="mb-4">Connectez vos outils externes via MCP.</p>
              <button className="btn-primary">Ajouter connecteur</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSystemCards;
