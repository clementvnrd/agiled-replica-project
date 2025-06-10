import React from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  ChevronDown, 
  Plus,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { GlobalSearch, SearchResult } from '@/components/ui/search';
import { NotificationsCenter } from '@/components/ui/notifications-center';
import { useNotifications } from '@/hooks/use-notifications';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotifications();

  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    // Mock search - replace with actual search implementation
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Dashboard',
        type: 'Navigation',
        url: '/dashboard'
      },
      {
        id: '2',
        title: 'Agent Manager',
        type: 'IA',
        url: '/agent'
      },
      {
        id: '3',
        title: 'CRM',
        type: 'Business',
        url: '/crm'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      (result.type && result.type.toLowerCase().includes(query.toLowerCase()))
    );

    return mockResults;
  };

  const handleSearchSelect = (result: SearchResult) => {
    navigate(result.url);
  };

  return (
    <header className="h-16 bg-white border-b border-agiled-lightBorder flex items-center px-4">
      <div className="flex-1 flex items-center">
        <GlobalSearch
          placeholder="Chercher dans l'application..."
          onSearch={handleSearch}
          onSelect={handleSearchSelect}
          className="w-64"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-agiled-lightText">
          <Briefcase size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-agiled-lightText">
          <Moon size={20} />
        </Button>
        
        <NotificationsCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDismiss={dismiss}
        />
        
        <div className="flex items-center gap-2">
          <Button className="bg-agiled-primary hover:bg-agiled-primary/90">
            Créer
          </Button>
          <Button variant="outline" size="icon" className="border-l border-agiled-lightBorder">
            <ChevronDown size={18} />
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-3 border-l border-agiled-lightBorder cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-agiled-primary text-white flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user?.fullName?.charAt(0)?.toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.fullName || user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate('/profil')}>
              Profil
            </DropdownMenuItem>
            <SignOutButton>
              <DropdownMenuItem asChild>
                <span>Log out</span>
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
