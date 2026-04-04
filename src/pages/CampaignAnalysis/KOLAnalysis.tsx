import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import TableContainer from '../../components/TableContainer';
import { battleAnalysisData } from '../../data/marketingEffectData';

// ── 数据类型 ──────────────────────────────────────────────
type IssueStatus = '待处理' | '处理中' | '已解决';
type IssueSeverity = '高' | '中' | '低';

interface KOLIssue {
  id: number;
  title: string;
  severity: IssueSeverity;
  status: IssueStatus;
  discovered: string;
  resolved?: string;
  description: string;
  owner: string;
}

interface KOLData {
  id: string;
  name: string;
  platform: string;
  followers: number;
  marketingExpense: string;
  views: number;
  likes: number;
  comments: number;
  positiveRatio: number;
  cpc: number;
  engagementRate: number;
  issues?: KOLIssue[];
}

// ── 模拟KOL数据 ──────────────────────────────────────────────
const KOL_DATA: Record<string, KOLData[]> = {
  xiaohongshu: [
    {
      id: 'kol_1',
      name: '于适',
      platform: '小红书',
      followers: 2875000,
      marketingExpense: '¥280,000',
      views: 2310000,
      likes: 185000,
      comments: 12500,
      positiveRatio: 92,
      cpc: 12.1,
      engagementRate: 8.5,
      issues: [
        { id: 1, title: '内容质量下降', severity: '中', status: '处理中', discovered: '2026-10-10', description: '最近发布的内容互动率明显下降，需要优化内容策略。', owner: '张明' },
      ],
    },
    {
      id: 'kol_2',
      name: '张艺凡',
      platform: '小红书',
      followers: 2310000,
      marketingExpense: '¥250,000',
      views: 1980000,
      likes: 158000,
      comments: 9800,
      positiveRatio: 89,
      cpc: 12.6,
      engagementRate: 8.2,
      issues: [],
    },
    {
      id: 'kol_3',
      name: '叠变',
      platform: '小红书',
      followers: 1567000,
      marketingExpense: '¥180,000',
      views: 1420000,
      likes: 98000,
      comments: 6200,
      positiveRatio: 88,
      cpc: 12.7,
      engagementRate: 7.3,
      issues: [
        { id: 2, title: '虚假流量风险', severity: '高', status: '待处理', discovered: '2026-10-15', description: '检测到异常的点赞和评论行为，疑似存在刷单行为，需要进一步调查。', owner: '李华' },
      ],
    },
  ],
  douyin: [
    {
      id: 'kol_4',
      name: 'EH设计师视频',
      platform: '抖音',
      followers: 3200000,
      marketingExpense: '¥320,000',
      views: 4560000,
      likes: 285000,
      comments: 18900,
      positiveRatio: 85,
      cpc: 7.0,
      engagementRate: 6.6,
      issues: [
        { id: 3, title: '品牌露出不足', severity: '中', status: '已解决', discovered: '2026-09-20', resolved: '2026-10-05', description: '首个视频品牌露出时间过短，已与KOL沟通优化后续内容。', owner: '王芳' },
      ],
    },
    {
      id: 'kol_5',
      name: '外人节',
      platform: '抖音',
      followers: 1850000,
      marketingExpense: '¥200,000',
      views: 2890000,
      likes: 156000,
      comments: 8900,
      positiveRatio: 82,
      cpc: 6.9,
      engagementRate: 5.8,
      issues: [
        { id: 4, title: '内容低俗风险', severity: '高', status: '处理中', discovered: '2026-10-12', description: '部分内容涉及不当言论，已要求删除并重新审核后续内容。', owner: '陈刚' },
      ],
    },
  ],
  weibo: [
    {
      id: 'kol_6',
      name: '时尚博主A',
      platform: '微博',
      followers: 1200000,
      marketingExpense: '¥150,000',
      views: 890000,
      likes: 45000,
      comments: 3200,
      positiveRatio: 80,
      cpc: 16.9,
      engagementRate: 5.4,
      issues: [],
    },
  ],
};

// ── 辅助组件 ──────────────────────────────────────────────
const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
);

const severityColor = (s: IssueSeverity) =>
  s === '高' ? 'bg-red-100 text-red-700' : s === '中' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

const statusColor = (s: IssueStatus) =>
  s === '已解决' ? 'bg-green-100 text-green-700' : s === '处理中' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';

const engagementColor = (rate: number) =>
  rate >= 8 ? 'text-green-600 font-medium' : rate >= 6 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium';

// ── 主组件 ──────────────────────────────────────────────
export default function KOLAnalysis() {
  const [selectedPlatform, setSelectedPlatform] = useState('xiaohongshu');
  const [selectedKOL, setSelectedKOL] = useState<KOLData | null>(null);
  const [activeTab, setActiveTab] = useState<'marketing' | 'risk'>('marketing');

  const platforms = [
    { value: 'xiaohongshu', label: '小红书' },
    { value: 'douyin', label: '抖音' },
    { value: 'weibo', label: '微博' },
  ];

  const currentPlatformKOLs = KOL_DATA[selectedPlatform] || [];
  const activeKOL = selectedKOL || currentPlatformKOLs[0];

  const totalIssues = activeKOL?.issues?.length || 0;
  const resolvedIssues = activeKOL?.issues?.filter(i => i.status === '已解决').length || 0;
  const closureRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;
  const openIssues = activeKOL?.issues?.filter(i => i.status !== '已解决') || [];
  const highSeverityOpen = openIssues.filter(i => i.severity === '高').length;

  return (
    <Layout title="KOL分析 — 以叠变应万变">

      {/* 平台选择栏 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <p className="text-xs text-gray-500 mb-3">选择投放平台</p>
        <div className="flex gap-3 flex-wrap">
          {platforms.map(platform => (
            <button
              key={platform.value}
              onClick={() => {
                setSelectedPlatform(platform.value);
                setSelectedKOL(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedPlatform === platform.value
                  ? 'bg-[#002060] text-white border-[#002060] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002060]'
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* KOL选择栏 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <p className="text-xs text-gray-500 mb-3">选择KOL</p>
        <div className="flex gap-3 flex-wrap">
          {currentPlatformKOLs.map(kol => (
            <button
              key={kol.id}
              onClick={() => setSelectedKOL(kol)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                activeKOL?.id === kol.id
                  ? 'bg-[#002060] text-white border-[#002060] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002060]'
              }`}
            >
              <span>{kol.name}</span>
              {kol.issues && kol.issues.filter(i => i.status !== '已解决' && i.severity === '高').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {kol.issues.filter(i => i.status !== '已解决' && i.severity === '高').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KOL概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: '粉丝数', value: `${(activeKOL.followers / 10000).toFixed(0)}万` },
          { label: '营销投入', value: activeKOL.marketingExpense },
          { label: '播放量', value: `${(activeKOL.views / 10000).toFixed(0)}万` },
          { label: '正面占比', value: `${activeKOL.positiveRatio}%` },
          { label: 'CPC', value: `¥${activeKOL.cpc}` },
          { label: '互动率', value: `${activeKOL.engagementRate}%`, valueClass: engagementColor(activeKOL.engagementRate) },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`text-lg font-bold ${item.valueClass ?? 'text-gray-800'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tab 切换：业务视角 / 风险视角 */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'marketing' ? 'bg-white text-[#002060] shadow' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fa-solid fa-chart-bar mr-2"></i>业务执行视角
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'risk' ? 'bg-white text-[#002060] shadow' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fa-solid fa-shield-halved mr-1"></i>风险监控视角
          {highSeverityOpen > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{highSeverityOpen}</span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'marketing' ? (
          <motion.div key="marketing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* KOL效果分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 内容表现 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">内容表现指标</h3>
                <div className="space-y-4">
                  {[
                    { name: '播放量', value: activeKOL.views, unit: '次', benchmark: 1500000 },
                    { name: '点赞量', value: activeKOL.likes, unit: '个', benchmark: 150000 },
                    { name: '评论量', value: activeKOL.comments, unit: '条', benchmark: 10000 },
                  ].map((item, i) => {
                    const percentage = (item.value / item.benchmark) * 100;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium text-gray-800">{(item.value / 10000).toFixed(1)}万 {item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${percentage >= 100 ? 'bg-green-500' : percentage >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 投入产出分析 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">投入产出分析</h3>
                <div className="space-y-4">
                  {[
                    { label: '营销投入', value: activeKOL.marketingExpense, icon: 'fa-money-bill-wave' },
                    { label: 'CPC', value: `¥${activeKOL.cpc}`, icon: 'fa-tag' },
                    { label: '互动率', value: `${activeKOL.engagementRate}%`, icon: 'fa-heart' },
                    { label: '正面占比', value: `${activeKOL.positiveRatio}%`, icon: 'fa-thumbs-up' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className={`fa-solid ${item.icon} text-blue-600`}></i>
                        </div>
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 全平台KOL对比表 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{activeKOL.platform} 平台KOL对比</h3>
                <p className="text-xs text-gray-500 mt-0.5">同平台KOL的效果对标分析</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KOL名称</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">粉丝数</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">播放量</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">互动率</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">正面占比</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentPlatformKOLs.map((kol) => (
                      <tr key={kol.id} className={`hover:bg-gray-50 ${activeKOL.id === kol.id ? 'bg-blue-50' : ''}`}>
                        <td className={`px-6 py-3 font-medium ${activeKOL.id === kol.id ? 'text-[#002060]' : 'text-gray-800'}`}>
                          {kol.name}
                          {activeKOL.id === kol.id && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">当前选中</span>}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500">{(kol.followers / 10000).toFixed(0)}万</td>
                        <td className="px-6 py-3 text-right text-gray-500">{(kol.views / 10000).toFixed(0)}万</td>
                        <td className={`px-6 py-3 text-right ${engagementColor(kol.engagementRate)}`}>{kol.engagementRate}%</td>
                        <td className="px-6 py-3 text-right text-gray-500">{kol.positiveRatio}%</td>
                        <td className="px-6 py-3 text-right text-gray-500">¥{kol.cpc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div key="risk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* 风险概览指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: '累计发现问题', value: totalIssues, icon: 'fa-circle-exclamation', color: 'bg-gray-100 text-gray-600' },
                { label: '已解决问题', value: resolvedIssues, icon: 'fa-circle-check', color: 'bg-green-100 text-green-600' },
                { label: '待处理 / 处理中', value: openIssues.length, icon: 'fa-clock', color: 'bg-amber-100 text-amber-600' },
                { label: '问题闭环率', value: `${closureRate}%`, icon: 'fa-chart-pie', color: closureRate >= 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-3">
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xl font-bold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 风险评估 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">KOL风险评估</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: '内容风险',
                    level: activeKOL.positiveRatio >= 85 ? '低' : activeKOL.positiveRatio >= 75 ? '中' : '高',
                    description: `正面占比 ${activeKOL.positiveRatio}%`,
                    icon: 'fa-file-lines',
                  },
                  {
                    title: '流量风险',
                    level: activeKOL.engagementRate >= 7 ? '低' : activeKOL.engagementRate >= 5 ? '中' : '高',
                    description: `互动率 ${activeKOL.engagementRate}%`,
                    icon: 'fa-chart-line',
                  },
                  {
                    title: '合规风险',
                    level: highSeverityOpen === 0 ? '低' : highSeverityOpen === 1 ? '中' : '高',
                    description: `${highSeverityOpen} 个高风险问题`,
                    icon: 'fa-shield-halved',
                  },
                ].map((item, i) => {
                  const levelColor = item.level === '低' ? 'bg-green-100 text-green-700' : item.level === '中' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
                  return (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <i className={`fa-solid ${item.icon} text-gray-400`}></i>
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${levelColor} mb-2`}>
                        {item.level}风险
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 问题清单 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">风险问题台账</h3>
                  <p className="text-xs text-gray-500 mt-0.5">记录 {activeKOL.name} 的所有已发现问题</p>
                </div>
                {highSeverityOpen > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
                    <span className="text-sm text-red-700 font-medium">{highSeverityOpen} 个高风险问题待处理</span>
                  </div>
                )}
              </div>
              {activeKOL.issues && activeKOL.issues.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {activeKOL.issues.map(issue => (
                    <motion.div key={issue.id} whileHover={{ backgroundColor: '#f9fafb' }} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-gray-800">{issue.title}</span>
                            <Tag label={`严重程度：${issue.severity}`} color={severityColor(issue.severity)} />
                            <Tag label={issue.status} color={statusColor(issue.status)} />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span><i className="fa-regular fa-calendar mr-1"></i>发现：{issue.discovered}</span>
                            {issue.resolved && <span><i className="fa-regular fa-calendar-check mr-1"></i>解决：{issue.resolved}</span>}
                            <span><i className="fa-regular fa-user mr-1"></i>负责人：{issue.owner}</span>
                          </div>
                        </div>
                        {issue.status === '已解决' && (
                          <div className="shrink-0 text-green-500">
                            <i className="fa-solid fa-circle-check text-xl"></i>
                          </div>
                        )}
                        {issue.status === '待处理' && (
                          <div className="shrink-0 text-red-400">
                            <i className="fa-solid fa-circle-exclamation text-xl"></i>
                          </div>
                        )}
                        {issue.status === '处理中' && (
                          <div className="shrink-0 text-amber-400">
                            <i className="fa-solid fa-spinner text-xl"></i>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <i className="fa-solid fa-circle-check text-4xl text-green-400 mb-2"></i>
                  <p className="text-gray-500">暂无问题记录，该KOL运营良好</p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
