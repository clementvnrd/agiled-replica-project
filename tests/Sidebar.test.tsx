import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../src/components/Sidebar';
import React from 'react';
import { vi } from 'vitest';

describe('Sidebar', () => {
  it('affiche les catégories principales', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
    expect(screen.getByText(/Business/i)).toBeInTheDocument();
    expect(screen.getByText(/Personnel/i)).toBeInTheDocument();
    expect(screen.getByText(/Intelligence Artificielle/i)).toBeInTheDocument();
  });

  it('déplie/replie les catégories', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const businessToggle = screen.getByText(/Business/i).closest('div');
    fireEvent.click(businessToggle!);
    const crmElement = screen.queryByText(/CRM/i);
    expect(crmElement).not.toBeInTheDocument();
    fireEvent.click(businessToggle!);
    expect(screen.getByText(/CRM/i)).toBeVisible();
  });
});
