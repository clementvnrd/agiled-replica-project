
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface SearchProps {
  placeholder?: string;
  className?: string;
}

export const GlobalSearch: React.FC<SearchProps> = ({
  placeholder = "Rechercher...",
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { documents: ragDocuments } = useRagDocuments();

  const searchResults = useMemo((): SearchResult[] => {
    if (!debouncedQuery) return [];
    
    const lowerCaseQuery = debouncedQuery.toLowerCase();
    
    const projectResults: SearchResult[] = (projects || [])
      .filter(p => p.name.toLowerCase().includes(lowerCaseQuery))
      .map(p => ({
        id: `proj-${p.id}`,
        title: p.name,
        type: 'Projet',
        url: `/projects/${p.id}`
      }));
      
    const taskResults: SearchResult[] = (tasks || [])
      .filter(t => t.title.toLowerCase().includes(lowerCaseQuery))
      .map(t => ({
        id: `task-${t.id}`,
        title: t.title,
        type: 'Tâche',
        url: `/projects/${t.project_id}`
      }));
      
    const ragResults: SearchResult[] = (ragDocuments || [])
      .filter(d => 
        (d.content && d.content.toLowerCase().includes(lowerCaseQuery)) || 
        (d.metadata?.title && d.metadata.title.toLowerCase().includes(lowerCaseQuery))
      )
      .map(d => ({
        id: `rag-${d.id}`,
        title: d.metadata?.title || d.content.substring(0, 50) + '...',
        type: 'Document',
        url: '/rag'
      }));

    return [...projectResults, ...taskResults, ...ragResults].slice(0, 10);
  }, [debouncedQuery, projects, tasks, ragDocuments]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  useEffect(() => {
    setIsOpen(debouncedQuery.length > 0);
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setIsOpen(false);
  };
  
  const handleClear = () => {
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
          onFocus={() => { if (query) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                className="px-3 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onMouseDown={() => handleSelect(result)}
              >
                <div className="font-medium text-sm">{result.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Aucun résultat pour "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { type SearchResult };
