
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Schéma de validation pour le formulaire de connexion MCP
const mcpConnectionSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis' }),
  url: z.string().url({ message: 'URL invalide' }),
  description: z.string().optional(),
  status: z.string().default('connected')
});

type MCPConnectionFormValues = z.infer<typeof mcpConnectionSchema>;

export interface MCPConnectionFormProps {
  onConnectionSubmit: (values: MCPConnectionFormValues) => Promise<void>;
  initialValues?: Partial<MCPConnectionFormValues>;
}

const MCPConnectionForm: React.FC<MCPConnectionFormProps> = ({ 
  onConnectionSubmit, 
  initialValues = {} 
}) => {
  const form = useForm<MCPConnectionFormValues>({
    resolver: zodResolver(mcpConnectionSchema),
    defaultValues: {
      name: initialValues.name || '',
      url: initialValues.url || '',
      description: initialValues.description || '',
      status: initialValues.status || 'connected'
    }
  });

  const onSubmit = async (values: MCPConnectionFormValues) => {
    await onConnectionSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Google Calendar MCP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du serveur</FormLabel>
              <FormControl>
                <Input placeholder="https://mcp-server.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de cette connexion..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={form.formState.isSubmitting}
          >
            Enregistrer la connexion
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MCPConnectionForm;
