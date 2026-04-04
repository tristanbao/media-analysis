import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FiltersProps {
  filters: {
    name: string;
    options: FilterOption[];
    placeholder?: string;
    type?: 'select' | 'date' | 'text';
  }[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...selectedFilters, [filterName]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filters.map(filter => (
          <div key={filter.name} className="space-y-1">
            <label className="text-xs font-medium text-gray-500 block">
              {filter.name}
            </label>
            {filter.type === 'select' ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002060] focus:border-[#002060] outline-none transition-colors"
                onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                value={selectedFilters[filter.name] || ''}
              >
                <option value="">{filter.placeholder || `选择${filter.name}`}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : filter.type === 'date' ? (
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002060] focus:border-[#002060] outline-none transition-colors"
                onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                value={selectedFilters[filter.name] || ''}
              />
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002060] focus:border-[#002060] outline-none transition-colors"
                placeholder={filter.placeholder || `输入${filter.name}`}
                onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                value={selectedFilters[filter.name] || ''}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}