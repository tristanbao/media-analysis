import { ReactNode } from 'react';

interface TableContainerProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
  actions?: ReactNode;
}

export default function TableContainer({
  title,
  children,
  description,
  className = '',
  actions,
}: TableContainerProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {actions}
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}