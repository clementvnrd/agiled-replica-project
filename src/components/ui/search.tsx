
import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
}

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
}

const GlobalSearch = React.forwardRef<HTMLDivElement, SearchProps>(
  ({ className, placeholder = "Rechercher...", onSearch, onSelect, ...props }, ref) => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSearch = React.useCallback(
      async (searchQuery: string) => {
        if (!onSearch || searchQuery.length < 2) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        try {
          const searchResults = await onSearch(searchQuery);
          setResults(searchResults);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        }
        setIsLoading(false);
      },
      [onSearch]
    );

    React.useEffect(() => {
      const debounceTimer = setTimeout(() => {
        handleSearch(query);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }, [query, handleSearch]);

    const handleSelect = (result: SearchResult) => {
      setQuery("");
      setIsOpen(false);
      onSelect?.(result);
    };

    const clearSearch = () => {
      setQuery("");
      setResults([]);
      setIsOpen(false);
    };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && (query.length >= 2 || results.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="p-3 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="font-medium">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.category}
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun résultat trouvé
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

GlobalSearch.displayName = "GlobalSearch";

export { GlobalSearch, type SearchResult };
