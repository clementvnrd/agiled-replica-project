
import React from 'react';
import { useCrmTickets } from '@/hooks/crm/useCrmTickets';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CrmTicketsPage: React.FC = () => {
  const { data: tickets, isLoading: isLoadingTickets, error: errorTickets } = useCrmTickets();
  const { data: contacts, isLoading: isLoadingContacts } = useCrmContacts();

  const isLoading = isLoadingTickets || isLoadingContacts;

  const contactsMap = React.useMemo(() => {
    if (!contacts) return new Map();
    return new Map(contacts.map(c => [c.id, c.name]));
  }, [contacts]);
  
  type BadgeVariant = BadgeProps["variant"];
  
  const priorityVariant: { [key: string]: BadgeVariant } = {
    'low': 'secondary',
    'medium': 'default',
    'high': 'destructive',
  };

  const statusVariant: { [key: string]: BadgeVariant } = {
    'open': 'success',
    'in-progress': 'info',
    'closed': 'secondary',
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
          <h1 className="text-2xl font-bold">Tickets CRM</h1>
          <p className="text-muted-foreground">Gérez toutes les demandes de support client.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Ticket</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>{renderSkeleton()}</TableCell>
                </TableRow>
              ) : errorTickets ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    Erreur lors du chargement des tickets.
                  </TableCell>
                </TableRow>
              ) : tickets && tickets.length > 0 ? (
                tickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">#{ticket.ticket_number}</TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.contact_id ? contactsMap.get(ticket.contact_id) || 'N/A' : 'N/A'}</TableCell>
                    <TableCell><Badge variant={priorityVariant[ticket.priority] || 'default'}>{ticket.priority}</Badge></TableCell>
                    <TableCell><Badge variant={statusVariant[ticket.status] || 'default'}>{ticket.status}</Badge></TableCell>
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
                    Aucun ticket trouvé.
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

export default CrmTicketsPage;
