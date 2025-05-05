
// Types généraux de l'application
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

// Types pour les données Supabase
export interface RagDocument {
  id: string; // ID est obligatoire
  user_id: string;
  content: string | null;
  metadata: Record<string, any>;
  embedding?: number[] | string | null;
  created_at: string | null;
}

export interface McpConnection {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description?: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

// Types pour les composants UI
export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  iconBg?: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface AgentResponse {
  message: string;
  sources?: Array<{
    content: string;
    metadata: Record<string, any>;
  }>;
  toolCalls?: Array<{
    name: string;
    parameters: Record<string, any>;
    result?: any;
  }>;
}

// Types pour les modules métier
export interface CrmContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status?: string;
  lastContact?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_progress' | 'done';
  assignedTo?: string;
  project?: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  paymentMethod?: string;
}
