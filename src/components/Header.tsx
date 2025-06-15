import React from 'react';
import { Search, Bell, Moon, ChevronDown, Plus, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { GlobalSearch, SearchResult } from '@/components/ui/search';
import { NotificationsCenter } from '@/components/ui/notifications-center';
import { useNotifications } from '@/hooks/use-notifications';
const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useSupabaseAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    dismiss
  } = useNotifications();
  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    // Mock search - replace with actual search implementation
    const mockResults: SearchResult[] = [{
      id: '1',
      title: 'Dashboard',
      type: 'Navigation',
      url: '/dashboard'
    }, {
      id: '2',
      title: 'Agent Manager',
      type: 'IA',
      url: '/agent'
    }, {
      id: '3',
      title: 'CRM',
      type: 'Business',
      url: '/crm'
    }].filter(result => result.title.toLowerCase().includes(query.toLowerCase()) || result.type && result.type.toLowerCase().includes(query.toLowerCase()));
    return mockResults;
  };
  const handleSearchSelect = (result: SearchResult) => {
    navigate(result.url);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Récupérer les initiales de l'utilisateur pour l'avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Récupérer le nom d'affichage de l'utilisateur
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email || 'Utilisateur';
  };
  return <header className="h-16 bg-white border-b border-agiled-lightBorder flex items-center px-4">
      <div className="flex-1 flex items-center">
        <GlobalSearch placeholder="Chercher dans l'application..." onSearch={handleSearch} onSelect={handleSearchSelect} className="w-64" />
      </div>
      
      <div className="flex items-center space-x-4">
        
        
        <Button variant="ghost" size="icon" className="text-agiled-lightText">
          <Moon size={20} />
        </Button>
        
        <NotificationsCenter notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onDismiss={dismiss} />
        
        <div className="flex items-center gap-2">
          
          
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-3 border-l border-agiled-lightBorder cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-agiled-primary text-white flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : getUserInitials()}
              </div>
              <div className="text-sm">
                <p className="font-medium">{getDisplayName()}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate('/profil')}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSignOut}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};
export default Header;