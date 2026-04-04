import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import ChartContainer from '../components/ChartContainer';
import WordCloud from '../components/WordCloud';
import TableContainer from '../components/TableContainer';
import AccordionTable from '../components/AccordionTable';
import { battleAnalysisData } from '../data/marketingEffectData';

// 格式化数字显示
const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`;
  }
  return num.toString();
};

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

export default function CampaignAnalysis() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  // 处理筛选条件变化
  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    // 这里可以根据筛选条件过滤数据
  };

   // 准备按日趋势数据
  const dailyTrendData = useMemo(() => {
    // 简化日期显示，只保留月日
    return battleAnalysisData.dailyTrendData.slice(0, 30).map(item => ({
      date: item.date.substring(5),
      销量达成率: item.salesAchievementRate,
      订货量完成率: item.orderCompletionRate,
      营销费率: item.marketingExpenseRate,
      库存消耗日数: item.inventoryConsumptionDays,
    }));
  }, []);

  // 投入产出分析表的列定义
  const inputOutputColumns = [
    { key: 'name', label: '名称' },
    { key: 'sales', label: '销量', type: 'number' },
    { 
      key: 'salesAchievementRate', 
      label: '销量达成率', 
      type: 'percentage',
      isPositive: (value: number) => value >= 90
    },
    { key: 'orderQuantity', label: '订货量', type: 'number' },
    { 
      key: 'orderCompletionRate', 
      label: '订货量完成率', 
      type: 'percentage',
      isPositive: (value: number) => value >= 85
    },
    { key: 'inventory', label: '库存量', type: 'number' },
    { key: 'marketingExpense', label: '营销费用', type: 'currency' },
    { 
      key: 'marketingExpenseRate', 
      label: '营销费率', 
      type: 'percentage',
      isPositive: (value: number) => value <= 18
    },
    { key: 'newCustomers', label: '新客数', type: 'number' },
  ];

  // 媒介投入产出分析表的列定义
  const mediaInputOutputColumns = [
    { key: 'name', label: '名称' },
    { key: 'marketingExpense', label: '营销费用', type: 'currency' },
    { 
      key: 'marketingExpenseRate', 
      label: '营销费率', 
      type: 'percentage',
      isPositive: (value: number) => value <= 18
    },
    { key: 'viralContentCount', label: '热搜/爆文数量', type: 'number' },
    { key: 'newCustomers', label: '新客数', type: 'number' },
    { key: 'exposure', label: '曝光量', type: 'number' },
    { key: 'interactions', label: '互动量', type: 'number' },
    { key: 'ctr', label: 'CTR (%)', type: 'number' },
    { key: 'cpm', label: 'CPM (元)', type: 'number' },
    { key: 'cpc', label: 'CPC (元)', type: 'number' },
    { key: 'cpe', label: 'CPE (元)', type: 'number' },
  ];

  // 图表颜色
  const COLORS = [
    '#002060', '#3165B1', '#5285D5', '#73A5E9', 
    '#94C5FD', '#B5E5FF', '#D7F5FF', '#F0F8FF'
  ];

  // VOC环形图颜色
  const VOC_COLORS = {
    '正面': '#E62020',
    '中性': '#FF7E00',
    '负面': '#7F7F7F',
  };

  return (
    <Layout title="以叠变应万变营销活动分析">
      {/* 筛选条件 */}
      <Filters 
        filters={[
          { 
            name: '日期', 
            options: [], 
            type: 'date', 
            placeholder: '选择日期' 
          },
          { 
            name: '产品大类', 
            options: battleAnalysisData.filterOptions.productCategory, 
            type: 'select' 
          },
          { 
            name: '渠道', 
            options: battleAnalysisData.filterOptions.channel, 
            type: 'select' 
          },
          { 
            name: '产品小类', 
            options: battleAnalysisData.filterOptions.productSubcategory, 
            type: 'select' 
          },
          { 
            name: '货品', 
            options: battleAnalysisData.filterOptions.product, 
            type: 'select' 
          },
          { 
            name: '媒介', 
            options: battleAnalysisData.filterOptions.media, 
            type: 'select' 
          },
          { 
            name: '活动', 
            options: battleAnalysisData.filterOptions.activity, 
            type: 'select' 
          },
        ]}
        onFilterChange={handleFilterChange}
      />

      {/* 累计指标值 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {battleAnalysisData.accumulatedMetrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg flex items-center"
          >
            <div className={`mr-4 ${metric.color} p-3 rounded-full`}>
              <i className={`fa-solid ${metric.icon}`}></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">{metric.name}</p>
              <p className="text-xl font-bold text-gray-800">
                {metric.name.includes('费用') ? `¥${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 第二行 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 按日变动趋势 */}
        <ChartContainer title="关键指标按日变动趋势">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyTrendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 120]} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
               <Line type="monotone" dataKey="销量达成率" stroke="#002060" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="订货量完成率" stroke="#3165B1" strokeWidth={2} />
              <Line type="monotone" dataKey="营销费率" stroke="#E62020" strokeWidth={2} />
              <Line type="monotone" dataKey="库存消耗日数" stroke="#00A651" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* 费用类型分布 */}
        <ChartContainer title="费用类型分布">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={battleAnalysisData.expenseTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {battleAnalysisData.expenseTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} 元`, '费用']}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 第三行 - VOC评价分布和评论分析并排 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* VOC分布 */}
        <ChartContainer title="VOC评价分布">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={battleAnalysisData.vocDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {battleAnalysisData.vocDistribution.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={VOC_COLORS[entry.name as keyof typeof VOC_COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '占比']}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
         {/* VOC消费者评论分析表格 */}
        <TableContainer title="VOC消费者评论分析" description="各标签的声量及情感分析数据">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">声量</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">正面占比</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">中性占比</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">负面占比</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主要标签</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { label: 'EH设计师视频', volume: 1258000, positive: 85, neutral: 12, negative: 3, tags: ['高端', '机能', '先锋'] },
                  { label: '于适', volume: 2875000, positive: 92, neutral: 7, negative: 1, tags: ['适配', '种草', '清爽'] },
                  { label: '张艺凡', volume: 2310000, positive: 89, neutral: 8, negative: 3, tags: ['甜酷', '反差', '种草'] },
                  { label: '叠变', volume: 1567000, positive: 88, neutral: 10, negative: 2, tags: ['实用', '科技', '多穿'] },
                  { label: '外人节', volume: 986000, positive: 82, neutral: 15, negative: 3, tags: ['出圈', '户外', '共鸣'] }
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.label}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">{item.volume.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600">{item.positive}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-amber-600">{item.neutral}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">{item.negative}%</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableContainer>
      </div>
      {/* 投入产出分析表 */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* 投入产出分析表 */}
        <TableContainer title="投入产出分析表" description="按产品大类-渠道-产品小类-货品逐层分析">
          <AccordionTable 
            rows={battleAnalysisData.inputOutputData} 
            columns={inputOutputColumns} 
          />
        </TableContainer>
      </div>

      


    </Layout>
  );
}

