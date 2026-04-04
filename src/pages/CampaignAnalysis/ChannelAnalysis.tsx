import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import TableContainer from '../../components/TableContainer';
import { battleAnalysisData } from '../../data/marketingEffectData';

// ── 数据类型 ──────────────────────────────────────────────
type IssueStatus = '待处理' | '处理中' | '已解决';
type IssueSeverity = '高' | '中' | '低';

interface ChannelIssue {
  id: number;
  title: string;
  severity: IssueSeverity;
  status: IssueStatus;
  discovered: string;
  resolved?: string;
  description: string;
  owner: string;
}

interface ChannelData {
  id: string;
  channel: string;
  description: string;
  period: string;
  exposure: number;
  ctr: number;
  cpc: number;
  contractExposure?: number;
  contractCTR?: number;
  contractCPC?: number;
  completionRate?: number;
  issues?: ChannelIssue[];
}

// ── 模拟渠道数据 ──────────────────────────────────────────────
const CHANNEL_DATA: ChannelData[] = [
  {
    id: 'douyin',
    channel: '抖音',
    description: '短视频内容投放',
    period: '2026.08.01 - 2026.10.31',
    exposure: 8560000,
    ctr: 2.88,
    cpc: 5.46,
    contractExposure: 8000000,
    contractCTR: 2.5,
    contractCPC: 5.5,
    completionRate: 107,
    issues: [
      { id: 1, title: '机器人流量异常', severity: '中', status: '处理中', discovered: '2026-09-15', description: '检测到部分流量来自机器人账户，点赞率异常高，已通知平台处理。', owner: '张明' },
      { id: 2, title: '素材审核延迟', severity: '低', status: '已解决', discovered: '2026-08-20', resolved: '2026-08-28', description: '首批素材审核超时3天，后续优化了审核流程。', owner: '李华' },
    ],
  },
  {
    id: 'xiaohongshu',
    channel: '小红书',
    description: '笔记内容种草',
    period: '2026.08.01 - 2026.10.31',
    exposure: 4820000,
    ctr: 2.84,
    cpc: 5.36,
    contractExposure: 5000000,
    contractCTR: 3.0,
    contractCPC: 5.0,
    completionRate: 96,
    issues: [
      { id: 3, title: '曝光量未达标', severity: '中', status: '已解决', discovered: '2026-09-10', resolved: '2026-09-18', description: '第二阶段曝光量较合同约定低4%，补投了额外资源。', owner: '王芳' },
      { id: 4, title: '内容违规风险', severity: '高', status: '待处理', discovered: '2026-10-15', description: '部分笔记涉及虚假宣传，平台已删除，需要重新审视内容策略。', owner: '陈刚' },
    ],
  },
  {
    id: 'weibo',
    channel: '微博',
    description: '话题讨论传播',
    period: '2026.08.01 - 2026.10.31',
    exposure: 2950000,
    ctr: 2.49,
    cpc: 5.81,
    contractExposure: 3000000,
    contractCTR: 2.2,
    contractCPC: 6.0,
    completionRate: 98,
    issues: [
      { id: 5, title: '负面舆情监控', severity: '中', status: '处理中', discovered: '2026-09-25', description: '出现关于产品质量的负面评论，已启动舆情应对机制。', owner: '刘洋' },
    ],
  },
  {
    id: 'baidu',
    channel: '百度',
    description: '搜索引擎营销',
    period: '2026.08.01 - 2026.10.31',
    exposure: 520000,
    ctr: 2.33,
    cpc: 1.82,
    contractExposure: 500000,
    contractCTR: 2.0,
    contractCPC: 2.0,
    completionRate: 104,
    issues: [],
  },
  {
    id: 'wechat',
    channel: '微信视频号',
    description: '视频内容分发',
    period: '2026.08.01 - 2026.10.31',
    exposure: 590000,
    ctr: 0.40,
    cpc: 10.75,
    contractExposure: 600000,
    contractCTR: 0.5,
    contractCPC: 10.0,
    completionRate: 98,
    issues: [
      { id: 6, title: 'CTR低于预期', severity: '低', status: '已解决', discovered: '2026-09-05', resolved: '2026-09-25', description: 'CTR仅0.40%，低于合同约定0.5%，调整了定向策略后有所改善。', owner: '陈刚' },
    ],
  },
];

// ── 辅助组件 ──────────────────────────────────────────────
const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
);

const severityColor = (s: IssueSeverity) =>
  s === '高' ? 'bg-red-100 text-red-700' : s === '中' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

const statusColor = (s: IssueStatus) =>
  s === '已解决' ? 'bg-green-100 text-green-700' : s === '处理中' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';

const completionColor = (rate: number) =>
  rate >= 100 ? 'text-green-600 font-medium' : rate >= 90 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium';

// ── 主组件 ──────────────────────────────────────────────
export default function ChannelAnalysis() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelData>(CHANNEL_DATA[0]);
  const [activeTab, setActiveTab] = useState<'marketing' | 'risk'>('marketing');

  const totalIssues = selectedChannel.issues?.length || 0;
  const resolvedIssues = selectedChannel.issues?.filter(i => i.status === '已解决').length || 0;
  const closureRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;
  const openIssues = selectedChannel.issues?.filter(i => i.status !== '已解决') || [];
  const highSeverityOpen = openIssues.filter(i => i.severity === '高').length;

  return (
    <Layout title="投放渠道分析 — 以叠变应万变">

      {/* 渠道选择栏 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <p className="text-xs text-gray-500 mb-3">选择投放渠道</p>
        <div className="flex gap-3 flex-wrap">
          {CHANNEL_DATA.map(channel => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedChannel.id === channel.id
                  ? 'bg-[#002060] text-white border-[#002060] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002060]'
              }`}
            >
              <span>{channel.channel}</span>
              {channel.issues && channel.issues.filter(i => i.status !== '已解决' && i.severity === '高').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {channel.issues.filter(i => i.status !== '已解决' && i.severity === '高').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 渠道概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: '投放周期', value: selectedChannel.period },
          { label: '实际曝光', value: `${(selectedChannel.exposure / 10000).toFixed(1)}万` },
          { label: '实际CTR', value: `${selectedChannel.ctr}%` },
          { label: '实际CPC', value: `¥${selectedChannel.cpc}` },
          { label: '问题闭环率', value: `${closureRate}%`, valueClass: closureRate >= 80 ? 'text-green-600' : 'text-red-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`text-lg font-bold ${item.valueClass ?? 'text-gray-800'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tab 切换：营销视角 / 风险视角 */}
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

            {/* 合同约定 vs 实际执行 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">投放执行情况 — 合同约定 vs 实际</h3>
                <p className="text-xs text-gray-500 mt-0.5">渠道：{selectedChannel.channel} | 周期：{selectedChannel.period}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">指标</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">合同约定</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">实际执行</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">完成率</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">评价</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        name: '曝光量',
                        contract: `${(selectedChannel.contractExposure! / 10000).toFixed(0)}万`,
                        actual: `${(selectedChannel.exposure / 10000).toFixed(1)}万`,
                        rate: selectedChannel.completionRate!,
                      },
                      {
                        name: 'CTR',
                        contract: `${selectedChannel.contractCTR}%`,
                        actual: `${selectedChannel.ctr}%`,
                        rate: (selectedChannel.ctr / selectedChannel.contractCTR!) * 100,
                      },
                      {
                        name: 'CPC',
                        contract: `¥${selectedChannel.contractCPC}`,
                        actual: `¥${selectedChannel.cpc}`,
                        rate: (selectedChannel.contractCPC! / selectedChannel.cpc) * 100,
                      },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800">{row.name}</td>
                        <td className="px-6 py-3 text-right text-gray-500">{row.contract}</td>
                        <td className="px-6 py-3 text-right text-gray-700 font-medium">{row.actual}</td>
                        <td className={`px-6 py-3 text-right ${completionColor(row.rate)}`}>{row.rate.toFixed(0)}%</td>
                        <td className="px-6 py-3 text-left">
                          {row.rate >= 95 ? (
                            <Tag label="✓ 达标" color="bg-green-100 text-green-700" />
                          ) : row.rate >= 85 ? (
                            <Tag label="⚠ 略低" color="bg-amber-100 text-amber-700" />
                          ) : (
                            <Tag label="✗ 未达标" color="bg-red-100 text-red-700" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 执行进度可视化 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">投放指标完成度</h3>
              <div className="space-y-4">
                {[
                  { name: '曝光量', rate: selectedChannel.completionRate! },
                  { name: 'CTR', rate: (selectedChannel.ctr / selectedChannel.contractCTR!) * 100 },
                  { name: 'CPC', rate: (selectedChannel.contractCPC! / selectedChannel.cpc) * 100 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.name}</span>
                      <span className={completionColor(item.rate)}>{item.rate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${item.rate >= 100 ? 'bg-green-500' : item.rate >= 90 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(item.rate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
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

            {/* 问题清单 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">风险问题台账</h3>
                  <p className="text-xs text-gray-500 mt-0.5">记录 {selectedChannel.channel} 渠道的所有已发现问题</p>
                </div>
                {highSeverityOpen > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
                    <span className="text-sm text-red-700 font-medium">{highSeverityOpen} 个高风险问题待处理</span>
                  </div>
                )}
              </div>
              {selectedChannel.issues && selectedChannel.issues.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {selectedChannel.issues.map(issue => (
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
                  <p className="text-gray-500">暂无问题记录，该渠道运营良好</p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
