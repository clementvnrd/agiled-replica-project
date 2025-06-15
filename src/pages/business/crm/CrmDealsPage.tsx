
import React from 'react';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { useCrmAccounts } from '@/hooks/crm/useCrmAccounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

const CrmDealsPage: React.FC = () => {
  const { data: deals, isLoading: isLoadingDeals, error: errorDeals } = useCrmDeals();
  const { data: accounts, isLoading: isLoadingAccounts } = useCrmAccounts();

  const isLoading = isLoadingDeals || isLoadingAccounts;

  const accountsMap = React.useMemo(() => {
    if (!accounts) return new Map();
    return new Map(accounts.map(acc => [acc.id, acc.name]));
  }, [accounts]);
  
  const stageVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" | "success" } = {
    'won': 'success',
    'lost': 'destructive',
    'lead-in': 'secondary',
  };


  const renderSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Deals CRM</h1>
          <p className="text-muted-foreground">Suivez toutes vos opportunités de vente.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un deal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des deals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du deal</TableHead>
                <TableHead>Compte</TableHead>
                <TableHead>Étape</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Date de clôture</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>{renderSkeleton()}</TableCell>
                </TableRow>
              ) : errorDeals ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    Erreur lors du chargement des deals.
                  </TableCell>
                </TableRow>
              ) : deals && deals.length > 0 ? (
                deals.map(deal => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell>{accountsMap.get(deal.account_id) || 'N/A'}</TableCell>
                    <TableCell><Badge variant={stageVariant[deal.stage] || 'default'}>{deal.stage}</Badge></TableCell>
                    <TableCell>{deal.value ? `${Number(deal.value).toLocaleString('fr-FR')} €` : 'N/A'}</TableCell>
                    <TableCell>{deal.expected_close_date ? format(new Date(deal.expected_close_date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun deal trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmDealsPage;
