import { useState, Fragment } from 'react';

interface TableRow {
  id: string;
  data: Record<string, string | number>;
  children?: TableRow[];
  isPositive?: boolean;
}

interface Column {
  key: string;
  label: string;
  type?: 'number' | 'percentage' | 'currency' | 'status';
  format?: (value: any) => string;
  isPositive?: (value: any) => boolean;
}

interface AccordionTableProps {
  rows: TableRow[];
  columns: Column[];
  title?: string;
}

export default function AccordionTable({ rows, columns, title }: AccordionTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatCellValue = (value: any, column: Column) => {
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? `¥${value.toLocaleString()}` : value;
      case 'percentage':
        return typeof value === 'number' ? `${value}%` : value;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const renderRow = (row: TableRow, level = 0) => {
    const hasChildren = row.children && row.children.length > 0;
    const isExpanded = expandedRows[row.id] || false;
    const isPositive = row.isPositive !== undefined ? row.isPositive : true;

    return (
      <Fragment key={row.id}>
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
              {hasChildren && (
                <button 
                  onClick={() => toggleRow(row.id)}
                  className="mr-2 text-gray-500 hover:text-[#002060]"
                >
                  <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                </button>
              )}
              <span style={{ marginLeft: `${level * 16}px` }}>
                {row.data[columns[0].key]}
              </span>
            </div>
          </td>
       {columns.slice(1).map((column) => {
        const value = row.data[column.key];
        const isValuePositive = column.isPositive ? column.isPositive(value) : isPositive;
        
        // 根据指标类型和值添加背景颜色标记
        let cellClass = '';
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        
        if (column.key.includes('销量达成率') && numValue < 90) {
          // 销量达成率低：浅红色背景
          cellClass = 'bg-red-50';
        } else if (column.key.includes('订货量完成率') && numValue < 85) {
          // 订货量完成率低：浅红色背景
          cellClass = 'bg-red-50';
        } else if (column.key.includes('营销费率') && numValue > 18) {
          // 营销费率高：浅红色背景
          cellClass = 'bg-red-50';
        } else if (column.key === 'ctr' && numValue < 2.5) {
          // CTR低：浅红色背景
          cellClass = 'bg-red-50';
        } else if (column.key === 'cpc' && numValue > 5) {
          // CPC高：浅红色背景
          cellClass = 'bg-red-50';
        }
        
        return (
          <td 
            key={column.key} 
            className={`px-4 py-3 whitespace-nowrap ${
              column.type === 'percentage' || column.type === 'number'
                ? 'text-right'
                : ''
            } ${
              column.key.includes('达成率') || column.key.includes('完成率') || column.key.includes('费率') || 
              column.key === 'ctr' || column.key === 'cpc'
                ? isValuePositive 
                  ? 'text-green-600 font-medium' 
                  : 'text-red-600 font-medium'
                : ''
            } ${cellClass}`}
          >
            {formatCellValue(value, column)}
          </td>
        );
      })}
        </tr>
        
        {hasChildren && isExpanded && (
          row.children.map(childRow => renderRow(childRow, level + 1))
        )}
      </Fragment>
    );
  };

  return (
    <div className="overflow-x-auto">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.type === 'percentage' || column.type === 'number'
                    ? 'text-right'
                    : ''
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(row => renderRow(row))}
        </tbody>
      </table>
    </div>
  );
}