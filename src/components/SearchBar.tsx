import { Search } from 'lucide-react';

export default function SearchBar({ 
  onSearch 
}: { 
  onSearch: (query: string) => void 
}) {
  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search notes or question papers..."
        className="w-full px-4 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    </div>
  );
} 