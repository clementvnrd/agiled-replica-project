import { render, screen, fireEvent } from '@testing-library/react';
import SupabaseCredentialsForm from '../src/components/SupabaseCredentialsForm';
import React from 'react';
import { vi } from 'vitest';

describe('SupabaseCredentialsForm', () => {
  const onSave = vi.fn();
  const onSkip = vi.fn();

  it('affiche le formulaire et valide les champs requis', async () => {
    render(<SupabaseCredentialsForm onSave={onSave} onSkip={onSkip} />);
    expect(screen.getByLabelText(/URL Supabase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Clé anonyme/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Enregistrer/i));
    expect(await screen.findByText(/doit être valide/)).toBeInTheDocument();
    expect(await screen.findByText(/doit contenir au moins 20 caractères/)).toBeInTheDocument();
  });

  it('affiche une erreur si la clé est trop courte', async () => {
    render(<SupabaseCredentialsForm onSave={onSave} onSkip={onSkip} />);
    fireEvent.change(screen.getByLabelText(/URL Supabase/i), { target: { value: 'https://test.supabase.co' } });
    fireEvent.change(screen.getByLabelText(/Clé anonyme/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/Enregistrer/i));
    expect(await screen.findByText(/au moins 20 caractères/)).toBeInTheDocument();
  });

  it('appelle onSkip quand on clique sur Connecter plus tard', () => {
    render(<SupabaseCredentialsForm onSave={onSave} onSkip={onSkip} />);
    fireEvent.click(screen.getByText(/Connecter plus tard/i));
    expect(onSkip).toHaveBeenCalled();
  });
});
