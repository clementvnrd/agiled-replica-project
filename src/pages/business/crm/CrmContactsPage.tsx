
import React from 'react';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { useCrmAccounts } from '@/hooks/crm/useCrmAccounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CrmContactsPage: React.FC = () => {
  const { data: contacts, isLoading: isLoadingContacts, error: errorContacts } = useCrmContacts();
  const { data: accounts, isLoading: isLoadingAccounts } = useCrmAccounts();

  const isLoading = isLoadingContacts || isLoadingAccounts;

  const accountsMap = React.useMemo(() => {
    if (!accounts) return new Map();
    return new Map(accounts.map(acc => [acc.id, acc.name]));
  }, [accounts]);

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
          <h1 className="text-2xl font-bold">Contacts CRM</h1>
          <p className="text-muted-foreground">Gérez tous vos contacts professionnels.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Compte</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>{renderSkeleton()}</TableCell>
                </TableRow>
              ) : errorContacts ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    Erreur lors du chargement des contacts.
                  </TableCell>
                </TableRow>
              ) : contacts && contacts.length > 0 ? (
                contacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.account_id ? accountsMap.get(contact.account_id) || 'N/A' : 'N/A'}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.role}</TableCell>
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
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucun contact trouvé.
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

export default CrmContactsPage;
