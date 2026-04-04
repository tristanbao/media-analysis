import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';

// ── 数据类型 ──────────────────────────────────────────────
type IssueStatus = '待处理' | '处理中' | '已解决';
type IssueSeverity = '高' | '中' | '低';

interface Issue {
  id: number;
  title: string;
  severity: IssueSeverity;
  status: IssueStatus;
  discovered: string;
  resolved?: string;
  description: string;
  owner: string;
}

interface DeliveryItem {
  media: string;
  contractExposure: number;
  actualExposure: number;
  contractCTR: number;
  actualCTR: number;
  contractCPC: number;
  actualCPC: number;
  completionRate: number;
}

interface Agency {
  id: number;
  name: string;
  type: string;
  contractAmount: number;
  settledAmount: number;
  paidAmount: number;
  settlementStatus: string;
  contractStart: string;
  contractEnd: string;
  kpiScore: number;
  delivery: DeliveryItem[];
  issues: Issue[];
}

// ── 模拟数据 ──────────────────────────────────────────────
const AGENCIES: Agency[] = [
  {
    id: 1,
    name: '蓝色光标',
    type: '整合营销',
    contractAmount: 3200000,
    settledAmount: 2950000,
    paidAmount: 2500000,
    settlementStatus: '审核中',
    contractStart: '2026-08-01',
    contractEnd: '2026-10-31',
    kpiScore: 88,
    delivery: [
      { media: '抖音', contractExposure: 8000000, actualExposure: 8560000, contractCTR: 2.5, actualCTR: 2.88, contractCPC: 5.5, actualCPC: 5.46, completionRate: 107 },
      { media: '小红书', contractExposure: 5000000, actualExposure: 4820000, contractCTR: 3.0, actualCTR: 2.84, contractCPC: 5.0, actualCPC: 5.36, completionRate: 96 },
      { media: '微博', contractExposure: 3000000, actualExposure: 2950000, contractCTR: 2.2, actualCTR: 2.49, contractCPC: 6.0, actualCPC: 5.81, completionRate: 98 },
    ],
    issues: [
      { id: 1, title: '小红书曝光量未达标', severity: '中', status: '已解决', discovered: '2026-09-10', resolved: '2026-09-18', description: '第二阶段小红书曝光量较合同约定低4%，agency补投了额外资源。', owner: '张明' },
      { id: 2, title: '创意素材审批延迟', severity: '低', status: '已解决', discovered: '2026-08-15', resolved: '2026-08-22', description: '首批素材审批流程超时7天，影响首周投放节奏。', owner: '李华' },
      { id: 3, title: '结算发票信息有误', severity: '中', status: '处理中', discovered: '2026-10-20', description: '第二期结算发票税号填写错误，已退回重开。', owner: '王芳' },
    ],
  },
  {
    id: 2,
    name: '华扬联众',
    type: '数字媒体',
    contractAmount: 2100000,
    settledAmount: 2100000,
    paidAmount: 2100000,
    settlementStatus: '已完成',
    contractStart: '2026-08-01',
    contractEnd: '2026-10-31',
    kpiScore: 94,
    delivery: [
      { media: '百度SEM', contractExposure: 500000, actualExposure: 520000, contractCTR: 2.0, actualCTR: 2.33, contractCPC: 2.0, actualCPC: 1.82, completionRate: 104 },
      { media: '百度信息流', contractExposure: 1200000, actualExposure: 1280000, contractCTR: 1.8, actualCTR: 2.02, contractCPC: 1.2, actualCPC: 1.07, completionRate: 107 },
      { media: '微信视频号', contractExposure: 600000, actualExposure: 590000, contractCTR: 0.5, actualCTR: 0.40, contractCPC: 10.0, actualCPC: 10.75, completionRate: 98 },
    ],
    issues: [
      { id: 4, title: '微信视频号CTR低于约定', severity: '中', status: '已解决', discovered: '2026-09-05', resolved: '2026-09-25', description: 'CTR仅0.40%，低于合同约定0.5%，agency调整了定向策略后有所改善。', owner: '陈刚' },
    ],
  },
  {
    id: 3,
    name: '麦肯光明',
    type: '创意策略',
    contractAmount: 1500000,
    settledAmount: 1200000,
    paidAmount: 980000,
    settlementStatus: '已提交',
    contractStart: '2026-08-01',
    contractEnd: '2026-10-31',
    kpiScore: 76,
    delivery: [
      { media: '线下活动', contractExposure: 500000, actualExposure: 420000, contractCTR: 0, actualCTR: 0, contractCPC: 0, actualCPC: 0, completionRate: 84 },
      { media: '新品发布会', contractExposure: 300000, actualExposure: 280000, contractCTR: 0, actualCTR: 0, contractCPC: 0, actualCPC: 0, completionRate: 93 },
    ],
    issues: [
      { id: 5, title: '线下活动到场人数不足', severity: '高', status: '处理中', discovered: '2026-09-20', description: '外人节线下活动实际到场人数仅达目标的84%，影响品牌曝光效果。', owner: '刘洋' },
      { id: 6, title: '创意方案交付延迟', severity: '高', status: '待处理', discovered: '2026-10-05', description: '第三阶段创意方案延迟交付10天，导致投放节奏被迫调整。', owner: '刘洋' },
      { id: 7, title: '结算金额争议', severity: '高', status: '待处理', discovered: '2026-10-25', description: '线下活动实际执行费用与合同约定存在差异，双方对¥30万费用存在争议。', owner: '王芳' },
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

const settlementColor = (s: string) =>
  s === '已完成' ? 'bg-green-100 text-green-700' : s === '审核中' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';

const kpiColor = (score: number) =>
  score >= 90 ? 'text-green-600' : score >= 80 ? 'text-amber-600' : 'text-red-600';

const completionColor = (rate: number) =>
  rate >= 100 ? 'text-green-600 font-medium' : rate >= 90 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium';

// ── 主组件 ──────────────────────────────────────────────
export default function SupplierAnalysis() {
  const [selectedAgency, setSelectedAgency] = useState<Agency>(AGENCIES[0]);
  const [activeTab, setActiveTab] = useState<'marketing' | 'risk'>('marketing');

  const totalIssues = selectedAgency.issues.length;
  const resolvedIssues = selectedAgency.issues.filter(i => i.status === '已解决').length;
  const closureRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;
  const openIssues = selectedAgency.issues.filter(i => i.status !== '已解决');
  const highSeverityOpen = openIssues.filter(i => i.severity === '高').length;

  return (
    <Layout title="Agency 执行分析 — 以叠变应万变">

      {/* Agency 选择栏 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <p className="text-xs text-gray-500 mb-3">选择 Agency</p>
        <div className="flex gap-3 flex-wrap">
          {AGENCIES.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAgency(a)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedAgency.id === a.id
                  ? 'bg-[#002060] text-white border-[#002060] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002060]'
              }`}
            >
              <span>{a.name}</span>
              <span className="ml-2 text-xs opacity-70">{a.type}</span>
              {a.issues.filter(i => i.status !== '已解决' && i.severity === '高').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {a.issues.filter(i => i.status !== '已解决' && i.severity === '高').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Agency 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: '合同金额', value: `¥${(selectedAgency.contractAmount / 10000).toFixed(0)}万` },
          { label: '结算金额', value: `¥${(selectedAgency.settledAmount / 10000).toFixed(0)}万` },
          { label: '已付金额', value: `¥${(selectedAgency.paidAmount / 10000).toFixed(0)}万` },
          { label: '结算状态', value: selectedAgency.settlementStatus, badge: settlementColor(selectedAgency.settlementStatus) },
          { label: 'KPI 综合评分', value: `${selectedAgency.kpiScore}分`, valueClass: kpiColor(selectedAgency.kpiScore) },
          { label: '问题闭环率', value: `${closureRate}%`, valueClass: closureRate >= 80 ? 'text-green-600' : 'text-red-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            {item.badge ? (
              <Tag label={item.value} color={item.badge} />
            ) : (
              <p className={`text-lg font-bold ${item.valueClass ?? 'text-gray-800'}`}>{item.value}</p>
            )}
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
          <i className="fa-solid fa-chart-bar mr-2"></i>营销执行视角
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
                <p className="text-xs text-gray-500 mt-0.5">合同期：{selectedAgency.contractStart} ~ {selectedAgency.contractEnd}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">媒介</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">约定曝光</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">实际曝光</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">约定CTR</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">实际CTR</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">约定CPC</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">实际CPC</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">完成率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedAgency.delivery.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{row.media}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{(row.contractExposure / 10000).toFixed(0)}万</td>
                        <td className="px-4 py-3 text-right text-gray-700">{(row.actualExposure / 10000).toFixed(0)}万</td>
                        <td className="px-4 py-3 text-right text-gray-500">{row.contractCTR > 0 ? `${row.contractCTR}%` : '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{row.actualCTR > 0 ? `${row.actualCTR}%` : '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{row.contractCPC > 0 ? `¥${row.contractCPC}` : '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{row.actualCPC > 0 ? `¥${row.actualCPC}` : '—'}</td>
                        <td className={`px-4 py-3 text-right ${completionColor(row.completionRate)}`}>{row.completionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 执行进度可视化 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">各媒介曝光完成率</h3>
              <div className="space-y-4">
                {selectedAgency.delivery.map((row, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{row.media}</span>
                      <span className={completionColor(row.completionRate)}>{row.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${row.completionRate >= 100 ? 'bg-green-500' : row.completionRate >= 90 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(row.completionRate, 100)}%` }}
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
                  <h3 className="font-semibold text-gray-800">问题台账</h3>
                  <p className="text-xs text-gray-500 mt-0.5">记录该 Campaign 中 {selectedAgency.name} 的所有已发现问题</p>
                </div>
                {highSeverityOpen > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
                    <span className="text-sm text-red-700 font-medium">{highSeverityOpen} 个高风险问题待处理</span>
                  </div>
                )}
              </div>
              <div className="divide-y divide-gray-100">
                {selectedAgency.issues.map(issue => (
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
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

