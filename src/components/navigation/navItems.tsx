
import { Home, Book, Calendar, Settings, Users, FileText, Database, Bot, Plug, Sparkles, DollarSign, Building, LayoutDashboard, Ticket } from 'lucide-react';

export const navItems = [
  {
    icon: <Home size={16} />,
    label: "Tableau de bord",
    to: "/dashboard",
    status: "connected" as const,
  },
  {
    icon: <Book size={16} />,
    label: "Projets",
    to: "/projects",
  },
  {
    icon: <Calendar size={16} />,
    label: "Calendrier",
    to: "/calendar",
  },
];

export const crmNavItems = [
  {
    icon: <LayoutDashboard size={16} />,
    label: "Dashboard",
    to: "/crm",
    badge: { count: 3, variant: "info" as const },
  },
  {
    icon: <Building size={16} />,
    label: "Comptes",
    to: "/crm/accounts",
  },
  {
    icon: <Users size={16} />,
    label: "Contacts",
    to: "/crm/contacts",
  },
  {
    icon: <DollarSign size={16} />,
    label: "Deals",
    to: "/crm/deals",
  },
  {
    icon: <Ticket size={16} />,
    label: "Tickets",
    to: "/crm/tickets",
  },
];

export const productivityNavItems = [
  {
    icon: <FileText size={16} />,
    label: "Productivité",
    to: "/productivity",
    badge: { count: 5, variant: "warning" as const },
  },
];

export const financeNavItems = [
  {
    icon: <Book size={16} />,
    label: "Finance",
    to: "/finance",
    status: "disconnected" as const,
  },
];

export const personalNavItems = [
  {
    icon: <Users size={16} />,
    label: "Personnel",
    to: "/personal",
  },
  {
    icon: <FileText size={16} />,
    label: "Études",
    to: "/studies",
    badge: { count: 2, variant: "success" as const },
  },
  {
    icon: <Book size={16} />,
    label: "Fitness",
    to: "/fitness",
    status: "connected" as const,
  },
];

export const aiNavItems = [
  {
    icon: <Bot size={16} />,
    label: "Agent Manager",
    to: "/agent",
    status: "connected" as const,
    badge: { showDot: true, variant: "success" as const },
  },
];

export const settingsNavItems = [
  {
    icon: <Settings size={16} />,
    label: "Paramètres",
    to: "/settings",
  },
  {
    icon: <Users size={16} />,
    label: "Profil",
    to: "/profil",
  },
  {
    icon: <Plug size={16} />,
    label: "MCP Manager",
    to: "/mcp",
    status: "loading" as const,
  },
];
