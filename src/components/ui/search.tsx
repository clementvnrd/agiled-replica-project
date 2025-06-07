
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface SearchProps {
  placeholder?: string;
  className?: string;
  results?: SearchResult[];
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
}

export const GlobalSearch: React.FC<SearchProps> = ({
  placeholder = "Rechercher...",
  className,
  results = [],
  onSearch,
  onSelect
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    onSearch?.(value);
  };

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          onFocus={() => setIsOpen(query.length > 0)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="px-3 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelect(result)}
            >
              <div className="font-medium text-sm">{result.title}</div>
              <div className="text-xs text-muted-foreground">{result.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { type SearchResult };
