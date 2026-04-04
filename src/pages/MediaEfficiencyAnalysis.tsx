import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import TableContainer from '../components/TableContainer';

const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`;
  }
  return num.toString();
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MediaEfficiencyAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState('cpm');

  // 媒体效率指标数据
  const mediaMetricsData = useMemo(() => [
    { media: '小红书', cpm: 225.0, cpc: 5.36, cpe: 7.92, ctr: 2.84, roi: 1.87 },
    { media: '抖音', cpm: 230.7, cpc: 5.46, cpe: 8.00, ctr: 2.88, roi: 1.83 },
    { media: '微博', cpm: 213.3, cpc: 5.81, cpe: 8.60, ctr: 2.49, roi: 1.72 },
    { media: '百度', cpm: 226.9, cpc: 5.31, cpe: 9.92, ctr: 2.29, roi: 1.88 },
    { media: '微信视频号', cpm: 221.4, cpc: 5.45, cpe: 9.70, ctr: 2.28, roi: 1.84 },
    { media: '线下', cpm: 357.3, cpc: 7.99, cpe: 16.11, ctr: 2.22, roi: 1.25 },
  ], []);

  // 媒体投放效果对比
  const mediaPerformanceData = useMemo(() => [
    { media: '小红书', exposure: 12560000, interactions: 356890, viralContent: 12, newCustomers: 5272 },
    { media: '抖音', exposure: 14850000, interactions: 428560, viralContent: 15, newCustomers: 6272 },
    { media: '微博', exposure: 5860000, interactions: 145680, viralContent: 8, newCustomers: 2150 },
    { media: '百度', exposure: 4320000, interactions: 98760, viralContent: 3, newCustomers: 1845 },
    { media: '微信视频号', exposure: 3840000, interactions: 87650, viralContent: 5, newCustomers: 1560 },
    { media: '线下', exposure: 3450000, interactions: 76540, viralContent: 2, newCustomers: 1541 },
  ], []);

  // 媒体雷达图数据（标准化）
  const radarData = useMemo(() => [
    { metric: 'CPM效率', 小红书: 85, 抖音: 80, 微博: 90, 百度: 84, 微信视频号: 87 },
    { metric: 'CPC效率', 小红书: 88, 抖音: 87, 微博: 82, 百度: 89, 微信视频号: 88 },
    { metric: 'CTR表现', 小红书: 92, 抖音: 94, 微博: 81, 百度: 75, 微信视频号: 74 },
    { metric: '新客获取', 小红书: 84, 抖音: 100, 微博: 68, 百度: 59, 微信视频号: 50 },
    { metric: 'ROI表现', 小红书: 99, 抖音: 97, 微博: 91, 百度: 100, 微信视频号: 98 },
  ], []);

  // 媒体趋势数据
  const mediaTrendData = useMemo(() => [
    { week: '第1周', 小红书: 2.8, 抖音: 2.9, 微博: 2.4, 百度: 2.2, 微信视频号: 2.1 },
    { week: '第2周', 小红书: 2.9, 抖音: 3.0, 微博: 2.5, 百度: 2.3, 微信视频号: 2.2 },
    { week: '第3周', 小红书: 2.85, 抖音: 2.95, 微博: 2.45, 百度: 2.25, 微信视频号: 2.25 },
    { week: '第4周', 小红书: 2.84, 抖音: 2.88, 微博: 2.49, 百度: 2.29, 微信视频号: 2.28 },
  ], []);

  const COLORS = ['#002060', '#3165B1', '#5285D5', '#73A5E9', '#94C5FD'];

  // 获取选中指标的数据
  const getMetricData = () => {
    const metricMap: Record<string, string> = {
      cpm: 'CPM (元)',
      cpc: 'CPC (元)',
      cpe: 'CPE (元)',
      ctr: 'CTR (%)',
      roi: 'ROI',
    };
    return mediaMetricsData.map(item => ({
      media: item.media,
      value: item[selectedMetric as keyof typeof item],
    }));
  };

  return (
    <Layout title="媒体效率分析">
      {/* 顶部指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="平均CPM"
          value="¥242.4"
          change="3.2%"
          isPositive={false}
          icon="fa-chart-bar"
          iconColor="bg-blue-100 text-[#002060]"
        />
        <StatCard
          title="平均CPC"
          value="¥6.06"
          change="1.8%"
          isPositive={false}
          icon="fa-link"
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="平均CTR"
          value="2.67%"
          change="5.3%"
          isPositive={true}
          icon="fa-mouse"
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="平均ROI"
          value="1.73"
          change="2.1%"
          isPositive={true}
          icon="fa-chart-line"
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      {/* 媒体效率指标对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 效率指标选择和柱状图 */}
        <ChartContainer title="媒体效率指标对比">
          <div className="mb-4 flex gap-2 flex-wrap">
            {['cpm', 'cpc', 'cpe', 'ctr', 'roi'].map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedMetric === metric
                    ? 'bg-[#002060] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMetricData()} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="media" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#002060" radius={[4, 4, 0, 0]}>
                {getMetricData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 媒体雷达图 */}
        <ChartContainer title="媒体综合表现评分">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="小红书" dataKey="小红书" stroke="#002060" fill="#002060" fillOpacity={0.25} />
              <Radar name="抖音" dataKey="抖音" stroke="#3165B1" fill="#3165B1" fillOpacity={0.25} />
              <Radar name="微博" dataKey="微博" stroke="#5285D5" fill="#5285D5" fillOpacity={0.25} />
              <Radar name="百度" dataKey="百度" stroke="#73A5E9" fill="#73A5E9" fillOpacity={0.25} />
              <Radar name="微信视频号" dataKey="微信视频号" stroke="#94C5FD" fill="#94C5FD" fillOpacity={0.25} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* CTR趋势分析 */}
      <ChartContainer title="媒体CTR趋势分析" className="mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mediaTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis domain={[2, 3.1]} tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="小红书" stroke="#002060" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="抖音" stroke="#3165B1" strokeWidth={2} />
            <Line type="monotone" dataKey="微博" stroke="#5285D5" strokeWidth={2} />
            <Line type="monotone" dataKey="百度" stroke="#73A5E9" strokeWidth={2} />
            <Line type="monotone" dataKey="微信视频号" stroke="#94C5FD" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 媒体投放效果详细表 */}
      <TableContainer title="媒体投放效果详细分析" description="各媒体的曝光、互动、内容和新客数据">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">媒体</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">曝光量</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">互动量</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">互动率</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">热搜/爆文数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">新客数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">单客成本</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mediaPerformanceData.map((item, index) => {
                const investment = [2825296, 3425296, 1250000, 980000, 850000, 1232649][index];
                const cac = investment / item.newCustomers;
                const engagementRate = ((item.interactions / item.exposure) * 100).toFixed(2);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.media}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">{formatNumber(item.exposure)}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">{formatNumber(item.interactions)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">{engagementRate}%</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">{item.viralContent}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{item.newCustomers.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">¥{cac.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TableContainer>

      {/* 媒体效率排名 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* CPM效率排名 */}
        <ChartContainer title="CPM效率排名">
          <div className="space-y-3">
            {[...mediaMetricsData]
              .sort((a, b) => a.cpm - b.cpm)
              .map((item, index) => (
                <motion.div
                  key={item.media}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#002060] mr-3">#{index + 1}</span>
                    <span className="font-medium text-gray-800">{item.media}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">¥{item.cpm.toFixed(1)}</span>
                </motion.div>
              ))}
          </div>
        </ChartContainer>

        {/* CPC效率排名 */}
        <ChartContainer title="CPC效率排名">
          <div className="space-y-3">
            {[...mediaMetricsData]
              .sort((a, b) => a.cpc - b.cpc)
              .map((item, index) => (
                <motion.div
                  key={item.media}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#002060] mr-3">#{index + 1}</span>
                    <span className="font-medium text-gray-800">{item.media}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">¥{item.cpc.toFixed(2)}</span>
                </motion.div>
              ))}
          </div>
        </ChartContainer>

        {/* ROI排名 */}
        <ChartContainer title="ROI排名">
          <div className="space-y-3">
            {[...mediaMetricsData]
              .sort((a, b) => b.roi - a.roi)
              .map((item, index) => (
                <motion.div
                  key={item.media}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#002060] mr-3">#{index + 1}</span>
                    <span className="font-medium text-gray-800">{item.media}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{item.roi.toFixed(2)}</span>
                </motion.div>
              ))}
          </div>
        </ChartContainer>
      </div>
    </Layout>
  );
}

