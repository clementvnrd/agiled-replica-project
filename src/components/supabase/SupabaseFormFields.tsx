
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface SupabaseFormFieldsProps {
  form: UseFormReturn<{
    supabaseUrl: string;
    supabaseAnonKey: string;
  }>;
}

const SupabaseFormFields: React.FC<SupabaseFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="supabaseUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">URL Supabase</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://xxx.supabase.co" 
                {...field} 
                className="font-mono text-sm"
              />
            </FormControl>
            <FormDescription>
              L'URL de votre projet Supabase (se termine par .supabase.co)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="supabaseAnonKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Clé anonyme (anon key)</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="eyJ0eXAiOi..." 
                {...field}
                className="font-mono text-sm"
              />
            </FormControl>
            <FormDescription>
              La clé anonyme de votre projet Supabase (commence par eyJ...)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SupabaseFormFields;
