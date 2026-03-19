import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Search className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-9 pr-4 py-1.5 border border-gray-100 rounded-full leading-4 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-br-pink text-[10px] transition-all"
        placeholder="맛 이름이나 태그를 검색해보세요"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
