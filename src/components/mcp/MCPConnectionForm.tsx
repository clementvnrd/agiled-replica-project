
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

const formSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  url: z.string().url("L'URL doit être valide"),
  type: z.string().min(1, "Veuillez sélectionner un type"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MCPConnectionFormProps {
  userId: string | undefined;
  supabase: SupabaseClient;
  onSuccess?: () => void;
}

const MCPConnectionForm: React.FC<MCPConnectionFormProps> = ({ userId, supabase, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      type: '',
      description: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour ajouter un connecteur");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('mcp_connections')
        .insert({
          user_id: userId,
          name: values.name,
          url: values.url,
          type: values.type,
          description: values.description,
          status: 'disconnected',
        });
        
      if (error) throw error;
      
      toast.success('Connecteur MCP ajouté avec succès');
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      ErrorHandler.handleSupabaseError(err, 'addConnection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Ajouter un connecteur MCP</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Mon connecteur MCP" {...field} />
                </FormControl>
                <FormDescription>
                  Un nom descriptif pour identifier ce connecteur
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  La catégorie de ce connecteur MCP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/api" {...field} />
                </FormControl>
                <FormDescription>
                  L'URL du serveur MCP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="Description du connecteur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter le connecteur'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default MCPConnectionForm;
