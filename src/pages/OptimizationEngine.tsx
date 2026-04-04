import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import TableContainer from '../components/TableContainer';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
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

export default function OptimizationEngine() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 优化建议数据
  const optimizationSuggestions = useMemo(() => [
    {
      id: 1,
      category: '媒体投放',
      priority: '紧急',
      title: '小红书投放效率最优，建议增加预算',
      description: '小红书的ROI达到1.87，高于平均水平1.73，CTR为2.84%，建议增加投放预算20-30%',
      impact: '预期增加新客500-800人',
      estimatedROI: '+15%',
      status: '待执行',
      metrics: { current: 1.87, target: 2.15, improvement: '+15%' }
    },
    {
      id: 2,
      category: '媒体投放',
      priority: '重要',
      title: '线下媒体效率低，建议优化或减少',
      description: '线下媒体CPM为357.3元，远高于其他媒体，ROI仅1.25，建议重新评估投放策略',
      impact: '预期节省成本200-300万',
      estimatedROI: '+8%',
      status: '待执行',
      metrics: { current: 1.25, target: 1.50, improvement: '+20%' }
    },
    {
      id: 3,
      category: '产品优化',
      priority: '紧急',
      title: '尺码标准化问题影响转化',
      description: '用户反馈中尺码偏小占比35%，建议优化尺码表，提供详细尺码建议，预期可提升转化率3-5%',
      impact: '预期增加销量4000-6000件',
      estimatedROI: '+12%',
      status: '待执行',
      metrics: { current: 85, target: 92, improvement: '+8%' }
    },
    {
      id: 4,
      category: '内容策略',
      priority: '重要',
      title: '加强KOL合作，提升品牌声量',
      description: '抖音平台新客获取效率最高，建议增加与头部KOL的合作，扩大品牌影响力',
      impact: '预期增加品牌声量30-50%',
      estimatedROI: '+18%',
      status: '待执行',
      metrics: { current: 6272, target: 8500, improvement: '+35%' }
    },
    {
      id: 5,
      category: '渠道优化',
      priority: '一般',
      title: '优化电商渠道投放结构',
      description: '电商渠道销量达成率91.8%，但营销费率18.1%，建议优化投放时段和人群定向',
      impact: '预期降低费率1-2%',
      estimatedROI: '+6%',
      status: '待执行',
      metrics: { current: 18.1, target: 16.5, improvement: '-8.8%' }
    },
    {
      id: 6,
      category: '用户运营',
      priority: '一般',
      title: '建立用户反馈闭环机制',
      description: '负面评价中物流慢占比较高，建议建立反馈机制，及时改进，提升用户满意度',
      impact: '预期提升满意度3-5%',
      estimatedROI: '+4%',
      status: '待执行',
      metrics: { current: 82, target: 87, improvement: '+6%' }
    },
  ], []);

  // 按优先级分类
  const suggestionsByPriority = useMemo(() => {
    const urgent = optimizationSuggestions.filter(s => s.priority === '紧急');
    const important = optimizationSuggestions.filter(s => s.priority === '重要');
    const general = optimizationSuggestions.filter(s => s.priority === '一般');
    return { urgent, important, general };
  }, [optimizationSuggestions]);

  // 优化效果预测
  const optimizationForecastData = useMemo(() => [
    { month: '当前', sales: 46890, roi: 5.31, satisfaction: 82 },
    { month: '1个月后', sales: 51200, roi: 5.75, satisfaction: 84 },
    { month: '2个月后', sales: 56800, roi: 6.20, satisfaction: 86 },
    { month: '3个月后', sales: 63500, roi: 6.85, satisfaction: 88 },
  ], []);

  // 投放预算优化建议
  const budgetOptimizationData = useMemo(() => [
    { media: '小红书', current: 2825296, recommended: 3388355, change: '+20%', reason: 'ROI最优' },
    { media: '抖音', current: 3425296, recommended: 3850000, change: '+12%', reason: '新客获取效率高' },
    { media: '微博', current: 1250000, recommended: 1250000, change: '0%', reason: '保持现状' },
    { media: '百度', current: 980000, recommended: 1078000, change: '+10%', reason: 'ROI稳定' },
    { media: '微信视频号', current: 850000, recommended: 850000, change: '0%', reason: '保持现状' },
    { media: '线下', current: 1232649, recommended: 616325, change: '-50%', reason: 'ROI低，建议减少' },
  ], []);

  // 获取筛选后的建议
  const filteredSuggestions = useMemo(() => {
    if (selectedCategory === 'all') return optimizationSuggestions;
    return optimizationSuggestions.filter(s => s.category === selectedCategory);
  }, [selectedCategory, optimizationSuggestions]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '紧急':
        return 'bg-red-100 text-red-800';
      case '重要':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '媒体投放': 'bg-blue-100 text-blue-800',
      '产品优化': 'bg-green-100 text-green-800',
      '内容策略': 'bg-purple-100 text-purple-800',
      '渠道优化': 'bg-amber-100 text-amber-800',
      '用户运营': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout title="优化建议引擎">
      {/* 顶部指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="待执行建议"
          value={optimizationSuggestions.length}
          icon="fa-lightbulb"
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="紧急优先级"
          value={suggestionsByPriority.urgent.length}
          change="需立即处理"
          isPositive={false}
          icon="fa-exclamation-circle"
          iconColor="bg-red-100 text-red-600"
        />
        <StatCard
          title="预期ROI提升"
          value="+12.5%"
          change="全部执行后"
          isPositive={true}
          icon="fa-chart-line"
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="预期成本节省"
          value="¥250万"
          change="优化后"
          isPositive={true}
          icon="fa-piggy-bank"
          iconColor="bg-blue-100 text-blue-600"
        />
      </div>

      {/* 优化效果预测 */}
      <ChartContainer title="优化执行效果预测" description="执行所有建议后的预期效果" className="mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={optimizationForecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" name="销量" stroke="#002060" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="roi" name="ROI" stroke="#3165B1" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" name="满意度(%)" stroke="#E62020" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 预算优化建议 */}
      <TableContainer title="媒体投放预算优化建议" description="基于效率分析的预算重新分配方案" className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">媒体</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">当前预算</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">建议预算</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">变化</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">优化原因</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetOptimizationData.map((item, index) => {
                const changeNum = parseFloat(item.change);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.media}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">¥{item.current.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">¥{item.recommended.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-center text-sm font-bold ${
                      changeNum > 0 ? 'text-green-600' : changeNum < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.change}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {/* 优化建议列表 */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#002060] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            全部建议
          </button>
          {['媒体投放', '产品优化', '内容策略', '渠道优化', '用户运营'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002060] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#002060] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(suggestion.category)}`}>
                    {suggestion.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{suggestion.status}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">预期影响</p>
                  <p className="text-sm font-bold text-blue-600">{suggestion.impact}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">预期ROI提升</p>
                  <p className="text-sm font-bold text-green-600">{suggestion.estimatedROI}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">改进空间</p>
                  <p className="text-sm font-bold text-purple-600">{suggestion.metrics.improvement}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    当前: <span className="font-bold text-gray-800">{suggestion.metrics.current}</span>
                  </span>
                  <i className="fa-solid fa-arrow-right text-gray-400"></i>
                  <span className="text-gray-600">
                    目标: <span className="font-bold text-green-600">{suggestion.metrics.target}</span>
                  </span>
                </div>
                <button className="px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium">
                  查看详情
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 优先级分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 紧急建议 */}
        <ChartContainer title={`紧急优先级 (${suggestionsByPriority.urgent.length})`}>
          <div className="space-y-2">
            {suggestionsByPriority.urgent.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 5 }}
                className="p-3 bg-red-50 rounded-lg border-l-2 border-red-500"
              >
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.estimatedROI}</p>
              </motion.div>
            ))}
          </div>
        </ChartContainer>

        {/* 重要建议 */}
        <ChartContainer title={`重要优先级 (${suggestionsByPriority.important.length})`}>
          <div className="space-y-2">
            {suggestionsByPriority.important.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 5 }}
                className="p-3 bg-amber-50 rounded-lg border-l-2 border-amber-500"
              >
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.estimatedROI}</p>
              </motion.div>
            ))}
          </div>
        </ChartContainer>

        {/* 一般建议 */}
        <ChartContainer title={`一般优先级 (${suggestionsByPriority.general.length})`}>
          <div className="space-y-2">
            {suggestionsByPriority.general.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 5 }}
                className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-500"
              >
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.estimatedROI}</p>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </Layout>
  );
}

