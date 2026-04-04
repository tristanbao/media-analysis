import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import { marketingExpenseOverviewData } from '../data/marketingExpenseData';

// 格式化数字显示
const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`;
  }
  return num.toString();
};

export default function MarketingExpenseOverview() {
  const [showAdvertisingDetail, setShowAdvertisingDetail] = useState(false);

  // 处理广告宣传科目点击
  const handleAdvertisingClick = () => {
    setShowAdvertisingDetail(!showAdvertisingDetail);
  };

  // 图表颜色
  const COLORS = [
    '#002060', '#3165B1', '#5285D5', '#73A5E9', 
    '#94C5FD', '#B5E5FF', '#D7F5FF', '#F0F8FF'
  ];

  // 自定义tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 准备趋势图表数据
  const trendChartData = useMemo(() => {
    return marketingExpenseOverviewData.trendData.map(item => ({
      month: item.month.replace('-', '/'),
      预算执行率: item.budgetExecutionRate,
      销量达成率: item.salesAchievementRate,
      营销费率: item.marketingExpenseRate,
      营销费用合计: item.marketingExpense,
    }));
  }, []);

  // 准备费用场景图表数据
  const expenseScenarioData = useMemo(() => {
    if (showAdvertisingDetail) {
      return marketingExpenseOverviewData.advertisingSubcategories.map(item => ({
        name: item.name,
        value: item.value,
      }));
    }
    return marketingExpenseOverviewData.expenseScenarioDistribution.map(item => ({
      name: item.name,
      value: item.value,
    }));
  }, [showAdvertisingDetail]);

  return (
    <Layout title="营销投入总览">
      {/* 顶部指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {marketingExpenseOverviewData.metrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            secondaryValue={metric.secondaryValue}
            secondaryLabel={metric.secondaryLabel}
            icon={metric.icon}
            iconColor={metric.iconColor}
          />
        ))}
      </div>

      {/* 营销投入变动趋势图 */}
      <div className="mb-6">
        <ChartContainer title="营销投入变动趋势" description="近12个月营销关键指标变动情况">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                domain={[0, 120]} 
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 'dataMax + 5000000']}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="预算执行率" 
                stroke="#002060" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="销量达成率" 
                stroke="#3165B1" 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="营销费率" 
                stroke="#5285D5" 
                strokeWidth={2} 
              />
              <Bar 
                yAxisId="right" 
                dataKey="营销费用合计" 
                fill="#94C5FD" 
                radius={[4, 4, 0, 0]} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 第二行图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 营销费用分部门分布 */}
        <ChartContainer title="营销费用分部门分布">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketingExpenseOverviewData.departmentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {marketingExpenseOverviewData.departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} 元`, '费用']}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 营销费用分费用场景分布 */}
        <ChartContainer 
          title={showAdvertisingDetail ? "广告宣传二级科目分布" : "营销费用分费用场景分布"}
          actions={
            showAdvertisingDetail ? (
              <button 
                onClick={handleAdvertisingClick} 
                className="text-[#002060] text-sm font-medium hover:underline"
              >
                <i className="fa-solid fa-arrow-left mr-1"></i> 返回一级科目
              </button>
            ) : (
              <button 
                onClick={handleAdvertisingClick} 
                className="text-[#002060] text-sm font-medium hover:underline"
              >
                广告宣传 <i className="fa-solid fa-chevron-down ml-1"></i>
              </button>
            )
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={expenseScenarioData}
              margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} 元`, '费用']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#002060" radius={[0, 4, 4, 0]}>
                {expenseScenarioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 第三行图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营销费用分投放媒介分布 */}
        <ChartContainer title="营销费用分投放媒介分布">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={marketingExpenseOverviewData.mediaDistribution}
              margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => formatNumber(value)} />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} 元`, '费用']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#3165B1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 营销费用分产品大类分布 */}
        <ChartContainer title="营销费用分产品大类分布">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={marketingExpenseOverviewData.productDistribution}
              margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                domain={[0, 'dataMax + 2000000']}
                tickFormatter={(value) => formatNumber(value)}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 25]} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="marketingExpense" 
                name="营销费用" 
                fill="#5285D5" 
                radius={[4, 4, 0, 0]} 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="marketingExpenseRate" 
                name="营销费率" 
                stroke="#E62020" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Layout>
  );
}

