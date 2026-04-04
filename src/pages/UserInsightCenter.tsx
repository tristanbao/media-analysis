import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import TableContainer from '../components/TableContainer';

const CAMPAIGNS = [
  { id: 'all', label: '全部 Campaign' },
  { id: 'diebian', label: '以叠变应万变' },
  { id: 'pafu', label: '温暖泡芙从轻出发' },
  { id: 'areal', label: 'AREAL探索' },
];

type CampaignData = {
  totalVoice: string;
  positiveRatio: string;
  satisfaction: string;
  keywordHeat: string;
  sentiment: { name: string; value: number; color: string }[];
  trend: { week: string; positive: number; neutral: number; negative: number }[];
  categories: { category: string; count: number; percentage: number }[];
  keywords: { keyword: string; mentions: number; sentiment: string; trend: string }[];
  reviews: { id: number; rating: number; content: string; keywords: string[]; sentiment: string; date: string }[];
};

const CAMPAIGN_DATA: Record<string, CampaignData> = {
  all: {
    totalVoice: '1,258,463', positiveRatio: '75%', satisfaction: '4.2/5', keywordHeat: '2,845',
    sentiment: [
      { name: '正面', value: 75, color: '#E62020' },
      { name: '中性', value: 18, color: '#FF7E00' },
      { name: '负面', value: 7, color: '#7F7F7F' },
    ],
    trend: [
      { week: '第1周', positive: 72, neutral: 20, negative: 8 },
      { week: '第2周', positive: 74, neutral: 19, negative: 7 },
      { week: '第3周', positive: 76, neutral: 17, negative: 7 },
      { week: '第4周', positive: 75, neutral: 18, negative: 7 },
    ],
    categories: [
      { category: '产品质量', count: 2845, percentage: 88 },
      { category: '设计风格', count: 2156, percentage: 92 },
      { category: '价格定位', count: 1823, percentage: 45 },
      { category: '物流配送', count: 1456, percentage: 85 },
      { category: '售后服务', count: 987, percentage: 82 },
      { category: '尺码建议', count: 856, percentage: 35 },
    ],
    keywords: [
      { keyword: '保暖', mentions: 2845, sentiment: 'positive', trend: 'up' },
      { keyword: '时尚', mentions: 2156, sentiment: 'positive', trend: 'up' },
      { keyword: '舒适', mentions: 1987, sentiment: 'positive', trend: 'stable' },
      { keyword: '轻便', mentions: 1654, sentiment: 'positive', trend: 'up' },
      { keyword: '高品质', mentions: 1523, sentiment: 'positive', trend: 'up' },
      { keyword: '价格贵', mentions: 856, sentiment: 'negative', trend: 'down' },
      { keyword: '尺码偏小', mentions: 743, sentiment: 'negative', trend: 'stable' },
      { keyword: '物流慢', mentions: 612, sentiment: 'negative', trend: 'down' },
    ],
    reviews: [
      { id: 1, rating: 5, content: '保暖效果非常好，款式时尚，穿着很舒服，值得购买！', keywords: ['保暖', '时尚', '舒服'], sentiment: 'positive', date: '2026-10-28' },
      { id: 2, rating: 4, content: '衣服质量不错，设计很新颖，就是价格有点小贵。', keywords: ['质量好', '设计新颖', '价格贵'], sentiment: 'mixed', date: '2026-10-27' },
      { id: 3, rating: 5, content: '这款羽绒服轻便但保暖，颜色很正，物流也很快，非常满意！', keywords: ['轻便', '保暖', '颜色正', '物流快'], sentiment: 'positive', date: '2026-10-26' },
      { id: 4, rating: 3, content: '衣服本身不错，但尺码偏小，建议拍大一码。', keywords: ['尺码偏小'], sentiment: 'negative', date: '2026-10-25' },
      { id: 5, rating: 5, content: '做工精细，细节处理到位，是我穿过最好的羽绒服之一。', keywords: ['做工精细', '细节处理'], sentiment: 'positive', date: '2026-10-24' },
    ],
  },
  diebian: {
    totalVoice: '586,230', positiveRatio: '82%', satisfaction: '4.5/5', keywordHeat: '1,523',
    sentiment: [
      { name: '正面', value: 82, color: '#E62020' },
      { name: '中性', value: 13, color: '#FF7E00' },
      { name: '负面', value: 5, color: '#7F7F7F' },
    ],
    trend: [
      { week: '第1周', positive: 78, neutral: 16, negative: 6 },
      { week: '第2周', positive: 80, neutral: 14, negative: 6 },
      { week: '第3周', positive: 83, neutral: 12, negative: 5 },
      { week: '第4周', positive: 82, neutral: 13, negative: 5 },
    ],
    categories: [
      { category: '产品质量', count: 1456, percentage: 92 },
      { category: '设计风格', count: 1230, percentage: 95 },
      { category: '价格定位', count: 876, percentage: 52 },
      { category: '物流配送', count: 654, percentage: 88 },
      { category: '售后服务', count: 432, percentage: 85 },
      { category: '尺码建议', count: 312, percentage: 40 },
    ],
    keywords: [
      { keyword: '叠穿', mentions: 1523, sentiment: 'positive', trend: 'up' },
      { keyword: '时尚', mentions: 1320, sentiment: 'positive', trend: 'up' },
      { keyword: '多功能', mentions: 1156, sentiment: 'positive', trend: 'up' },
      { keyword: '轻便', mentions: 987, sentiment: 'positive', trend: 'stable' },
      { keyword: '设计感', mentions: 876, sentiment: 'positive', trend: 'up' },
      { keyword: '价格偏高', mentions: 432, sentiment: 'negative', trend: 'down' },
      { keyword: '尺码偏小', mentions: 312, sentiment: 'negative', trend: 'stable' },
      { keyword: '配色单一', mentions: 198, sentiment: 'negative', trend: 'down' },
    ],
    reviews: [
      { id: 1, rating: 5, content: '叠穿效果超好，设计感很强，朋友都问我在哪买的！', keywords: ['叠穿', '设计感'], sentiment: 'positive', date: '2026-10-28' },
      { id: 2, rating: 5, content: '多功能设计非常实用，一件顶好几件穿，很值！', keywords: ['多功能', '实用'], sentiment: 'positive', date: '2026-10-26' },
      { id: 3, rating: 4, content: '款式很新颖，就是颜色选择少了点，希望多出几个配色。', keywords: ['款式新颖', '配色单一'], sentiment: 'mixed', date: '2026-10-25' },
      { id: 4, rating: 3, content: '衣服不错但价格偏高，性价比一般。', keywords: ['价格偏高'], sentiment: 'negative', date: '2026-10-24' },
      { id: 5, rating: 5, content: '保暖又时尚，叠穿搭配很多，非常满意这次购买！', keywords: ['保暖', '时尚', '叠穿'], sentiment: 'positive', date: '2026-10-23' },
    ],
  },
  pafu: {
    totalVoice: '423,180', positiveRatio: '71%', satisfaction: '4.0/5', keywordHeat: '987',
    sentiment: [
      { name: '正面', value: 71, color: '#E62020' },
      { name: '中性', value: 20, color: '#FF7E00' },
      { name: '负面', value: 9, color: '#7F7F7F' },
    ],
    trend: [
      { week: '第1周', positive: 68, neutral: 22, negative: 10 },
      { week: '第2周', positive: 70, neutral: 21, negative: 9 },
      { week: '第3周', positive: 72, neutral: 19, negative: 9 },
      { week: '第4周', positive: 71, neutral: 20, negative: 9 },
    ],
    categories: [
      { category: '产品质量', count: 987, percentage: 82 },
      { category: '设计风格', count: 756, percentage: 88 },
      { category: '价格定位', count: 654, percentage: 42 },
      { category: '物流配送', count: 543, percentage: 80 },
      { category: '售后服务', count: 321, percentage: 78 },
      { category: '尺码建议', count: 298, percentage: 32 },
    ],
    keywords: [
      { keyword: '轻盈', mentions: 987, sentiment: 'positive', trend: 'up' },
      { keyword: '保暖', mentions: 876, sentiment: 'positive', trend: 'stable' },
      { keyword: '泡芙感', mentions: 765, sentiment: 'positive', trend: 'up' },
      { keyword: '舒适', mentions: 654, sentiment: 'positive', trend: 'stable' },
      { keyword: '可爱', mentions: 543, sentiment: 'positive', trend: 'up' },
      { keyword: '价格贵', mentions: 432, sentiment: 'negative', trend: 'stable' },
      { keyword: '尺码偏小', mentions: 298, sentiment: 'negative', trend: 'up' },
      { keyword: '物流慢', mentions: 187, sentiment: 'negative', trend: 'down' },
    ],
    reviews: [
      { id: 1, rating: 5, content: '泡芙感超强，穿上去又轻又暖，颜值很高！', keywords: ['泡芙感', '轻盈', '保暖'], sentiment: 'positive', date: '2026-10-20' },
      { id: 2, rating: 4, content: '很可爱的款式，穿着舒适，就是尺码偏小建议拍大一码。', keywords: ['可爱', '舒适', '尺码偏小'], sentiment: 'mixed', date: '2026-10-19' },
      { id: 3, rating: 3, content: '款式好看但价格偏贵，希望活动期间能便宜一些。', keywords: ['价格贵'], sentiment: 'negative', date: '2026-10-18' },
      { id: 4, rating: 5, content: '轻盈保暖两不误，出门很方便，非常喜欢！', keywords: ['轻盈', '保暖'], sentiment: 'positive', date: '2026-10-17' },
    ],
  },
  areal: {
    totalVoice: '249,053', positiveRatio: '68%', satisfaction: '3.9/5', keywordHeat: '654',
    sentiment: [
      { name: '正面', value: 68, color: '#E62020' },
      { name: '中性', value: 22, color: '#FF7E00' },
      { name: '负面', value: 10, color: '#7F7F7F' },
    ],
    trend: [
      { week: '第1周', positive: 65, neutral: 24, negative: 11 },
      { week: '第2周', positive: 67, neutral: 23, negative: 10 },
      { week: '第3周', positive: 69, neutral: 21, negative: 10 },
      { week: '第4周', positive: 68, neutral: 22, negative: 10 },
    ],
    categories: [
      { category: '产品质量', count: 654, percentage: 78 },
      { category: '设计风格', count: 543, percentage: 85 },
      { category: '价格定位', count: 432, percentage: 38 },
      { category: '物流配送', count: 321, percentage: 75 },
      { category: '售后服务', count: 234, percentage: 72 },
      { category: '尺码建议', count: 198, percentage: 30 },
    ],
    keywords: [
      { keyword: '户外感', mentions: 654, sentiment: 'positive', trend: 'up' },
      { keyword: '专业', mentions: 543, sentiment: 'positive', trend: 'up' },
      { keyword: '防风', mentions: 487, sentiment: 'positive', trend: 'stable' },
      { keyword: '耐穿', mentions: 398, sentiment: 'positive', trend: 'stable' },
      { keyword: '功能性强', mentions: 312, sentiment: 'positive', trend: 'up' },
      { keyword: '价格高', mentions: 287, sentiment: 'negative', trend: 'stable' },
      { keyword: '款式少', mentions: 198, sentiment: 'negative', trend: 'up' },
      { keyword: '偏重', mentions: 145, sentiment: 'negative', trend: 'down' },
    ],
    reviews: [
      { id: 1, rating: 5, content: '户外感很强，专业又好看，防风效果一流！', keywords: ['户外感', '专业', '防风'], sentiment: 'positive', date: '2026-08-25' },
      { id: 2, rating: 4, content: '功能性很强，耐穿，就是款式选择少了点。', keywords: ['功能性强', '耐穿', '款式少'], sentiment: 'mixed', date: '2026-08-23' },
      { id: 3, rating: 3, content: '质量不错但价格偏高，而且有点重，长时间穿有点累。', keywords: ['价格高', '偏重'], sentiment: 'negative', date: '2026-08-20' },
      { id: 4, rating: 5, content: '专业户外装备感十足，非常适合爬山徒步！', keywords: ['专业', '户外感'], sentiment: 'positive', date: '2026-08-18' },
    ],
  },
};

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

export default function UserInsightCenter() {
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const data = useMemo(() => CAMPAIGN_DATA[selectedCampaign], [selectedCampaign]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '正面';
      case 'negative': return '负面';
      default: return '中性';
    }
  };

  return (
    <Layout title="用户洞察中心">
      {/* Campaign 筛选 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Campaign：</span>
        {CAMPAIGNS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCampaign(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCampaign === c.id
                ? 'bg-[#002060] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 顶部指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="总声量" value={data.totalVoice} change="15.3%" isPositive={true} icon="fa-volume-up" iconColor="bg-blue-100 text-[#002060]" />
        <StatCard title="正面占比" value={data.positiveRatio} change="3.2%" isPositive={true} icon="fa-thumbs-up" iconColor="bg-green-100 text-green-600" />
        <StatCard title="平均满意度" value={data.satisfaction} change="2.1%" isPositive={true} icon="fa-star" iconColor="bg-amber-100 text-amber-600" />
        <StatCard title="关键词热度" value={data.keywordHeat} change="8.7%" isPositive={true} icon="fa-fire" iconColor="bg-red-100 text-red-600" />
      </div>

      {/* 情感分布和趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="用户评价情感分布">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.sentiment} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.sentiment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '占比']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="用户评价情感趋势">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="positive" name="正面" stroke="#E62020" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="neutral" name="中性" stroke="#FF7E00" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" name="负面" stroke="#7F7F7F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 用户反馈分类分析 */}
      <ChartContainer title="用户反馈分类分析" className="mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.categories} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="反馈数量" fill="#002060" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="percentage" name="正面占比" fill="#94C5FD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 关键词热度 */}
      <TableContainer title="关键词热度排行" description="用户提及最频繁的关键词" className="mb-6">
        <div className="space-y-2">
          {data.keywords.map((item, index) => (
            <motion.div key={item.keyword} whileHover={{ x: 5 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center flex-1">
                <span className="text-sm font-bold text-[#002060] mr-3 w-6">#{index + 1}</span>
                <span className="font-medium text-gray-800">{item.keyword}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${item.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.sentiment === 'positive' ? '正面' : '负面'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{item.mentions.toLocaleString()}</span>
                <span className={`text-xs ${item.trend === 'up' ? 'text-red-600' : item.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fa-solid fa-arrow-${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'right'}`}></i>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </TableContainer>

      {/* 用户评价精选 */}
      <TableContainer title="用户评价精选" description="代表性用户反馈样本">
        <div className="space-y-3">
          {data.reviews.map((review) => (
            <motion.div key={review.id} whileHover={{ x: 5 }} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(review.sentiment)}`}>
                    {getSentimentLabel(review.sentiment)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{review.content}</p>
              <div className="flex flex-wrap gap-1">
                {review.keywords.map((keyword, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </TableContainer>
    </Layout>
  );
}

