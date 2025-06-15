
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { GlobalSearch } from '@/components/ui/search';
import { NotificationsCenter } from '@/components/ui/notifications-center';
import { useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/providers/ThemeProvider';

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
  const { theme, setTheme } = useTheme();

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
  return <header className="h-16 bg-white border-b border-agiled-lightBorder flex items-center px-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex-1 flex items-center">
        <GlobalSearch placeholder="Chercher dans l'application..." className="w-64" />
      </div>
      
      <div className="flex items-center space-x-4">
        
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-agiled-lightText dark:text-gray-400"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="sr-only">Changer de thème</span>
        </Button>
        
        <NotificationsCenter notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onDismiss={dismiss} />
        
        <div className="flex items-center gap-2">
          
          
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-3 border-l border-agiled-lightBorder cursor-pointer dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-agiled-primary text-white flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : getUserInitials()}
              </div>
              <div className="text-sm dark:text-gray-200">
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
