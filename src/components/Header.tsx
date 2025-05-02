import React from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  ChevronDown, 
  Plus,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { name, avatar } = useUser();

  return (
    <header className="h-16 bg-white border-b border-agiled-lightBorder flex items-center px-4">
      <div className="flex-1 flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agiled-lightText" size={18} />
          <input
            type="text"
            placeholder="Chercher..."
            className="pl-10 pr-4 py-2 rounded-md border border-agiled-lightBorder w-64 focus:outline-none focus:ring-2 focus:ring-agiled-primary/20"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-agiled-lightText">
          <Briefcase size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-agiled-lightText">
          <Moon size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-agiled-lightText relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
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
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-agiled-lightText">Administrator</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate('/profil')}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {/* TODO: Log out */}}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
