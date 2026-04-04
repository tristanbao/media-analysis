import { ReactNode, useState } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  description?: string;
  helpText?: string;
  className?: string;
  contentClassName?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function ChartContainer({
  title,
  children,
  description,
  helpText,
  className = '',
  contentClassName = 'h-[300px]',
  onSearch,
  searchPlaceholder = '搜索...',
}: ChartContainerProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {helpText && (
              <div className="group relative">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700"
                  aria-label={`${title}说明`}
                >
                  ?
                </button>
                <div className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                  {helpText}
                </div>
              </div>
            )}
          </div>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {onSearch && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fa-solid fa-search text-gray-400"></i>
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002060] focus:border-[#002060] w-64 transition-all duration-300"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          )}
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
      <div className={`${contentClassName} w-full`}>
        {children}
      </div>
    </div>
  );
}