import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  secondaryValue?: string;
  secondaryLabel?: string;
  icon?: string;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  secondaryValue,
  secondaryLabel,
  icon = 'fa-chart-line',
  iconColor = 'bg-blue-100 text-blue-600',
  className = '',
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${className}`}
    >
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="flex items-end">
          <p className="text-2xl font-bold text-gray-800 mr-2">{value}</p>
          {change && (
            <span className={`text-xs flex items-center ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <i className={`fa-solid ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              {change}
            </span>
          )}
        </div>
        {secondaryValue && secondaryLabel && (
          <div className="mt-2 text-sm">
            <span className="text-gray-500">{secondaryLabel}：</span>
            <span className="text-gray-700 font-medium">{secondaryValue}</span>
          </div>
        )}
      </div>
      <div className={`${iconColor} p-3 rounded-full mt-4 self-end`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </motion.div>
  );
}