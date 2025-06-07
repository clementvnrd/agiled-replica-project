
import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
}

interface SearchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  placeholder?: string;
  onSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
}

const SearchComponent = React.forwardRef<HTMLDivElement, SearchProps>(
  ({ className, placeholder = "Rechercher...", onSelect, results = [], isLoading = false, ...props }, ref) => {
    const [query, setQuery] = React.useState("");
    const [showResults, setShowResults] = React.useState(false);

    const filteredResults = results.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.category.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (result: SearchResult) => {
      onSelect?.(result);
      setShowResults(false);
      setQuery("");
    };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => query.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="pl-10"
          />
        </div>
        
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-2 text-sm text-muted-foreground">Recherche...</div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <button
                  key={result.id}
                  className="w-full text-left p-2 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0"
                  onClick={() => handleSelect(result)}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-xs text-muted-foreground">{result.category}</div>
                </button>
              ))
            ) : query.length > 0 ? (
              <div className="p-2 text-sm text-muted-foreground">Aucun résultat trouvé</div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

SearchComponent.displayName = "Search";

export { SearchComponent as Search };
