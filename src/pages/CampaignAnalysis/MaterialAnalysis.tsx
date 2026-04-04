import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';

// ── 类型 ──────────────────────────────────────────────────
type AlertLevel = '高' | '中' | '低';
type MaterialStatus = '未达预期' | '需关注' | '达标';
type PreviewKind = 'video' | 'image';

interface PreviewItem {
  id: string;
  kind: PreviewKind;
  title: string;
  src?: string;
  poster?: string;
  note: string;
}

interface Material {
  id: number;
  name: string;
  type: string;
  producer: string;
  productionCost: number;
  deliveryCost: number;
  media: string;
  startDate: string;
  views: number;
  completionRate: number;
  targetCompletionRate: number;
  positiveRatio: number;
  negativeRatio: number;
  targetPositiveRatio: number;
  ctr: number;
  targetCtr: number;
  status: MaterialStatus;
  alertLevel: AlertLevel;
  aiTags: string[];
  aiAnalysis: string;
  userComments: string[];
  previewItems: PreviewItem[];
}

interface ProducerRecord {
  name: string;
  totalMaterials: number;
  underperformed: number;
  totalProductionCost: number;
  totalDeliveryCost: number;
  avgCompletionRate: number;
  avgPositiveRatio: number;
  riskLevel: AlertLevel;
  issues: string[];
}

// ── 数据 ──────────────────────────────────────────────────
const MATERIALS: Material[] = [
  {
    id: 1,
    name: 'EH设计师访谈视频-微博版',
    type: '品牌形象视频',
    producer: '麦肯光明',
    productionCost: 280000,
    deliveryCost: 950000,
    media: '微博',
    startDate: '2026-09-01',
    views: 950000,
    completionRate: 52,
    targetCompletionRate: 72,
    positiveRatio: 62,
    negativeRatio: 18,
    targetPositiveRatio: 80,
    ctr: 0.8,
    targetCtr: 2.2,
    status: '未达预期',
    alertLevel: '高',
    aiTags: ['叙事节奏慢', '目标受众偏差', '产品卖点不突出', '时长过长'],
    aiAnalysis: '该素材完播率仅52%，远低于目标72%，用户在前15秒大量流失。AI分析显示：视频开篇以设计师访谈切入，缺乏视觉冲击力，未能在黄金3秒内抓住用户注意力。负面评价中18%集中在“内容无聊”和“与产品关联弱”。结合微博平台用户偏好短平快内容的特点，建议将核心卖点前置，压缩时长至60秒以内，增加产品实际使用场景。',
    userComments: ['感觉和产品没什么关系', '太长了没看完', '设计师讲的东西听不懂'],
    previewItems: [
      {
        id: 'm1-video',
        kind: 'video',
        title: '正片预览',
        poster: '/materials/eh-weibo-poster.svg',
        note: '建议重点查看前 15 秒开场是否能快速带出产品卖点。',
      },
      {
        id: 'm1-frame-1',
        kind: 'image',
        title: '关键帧 01',
        src: '/materials/eh-weibo-frame-1.svg',
        note: '首帧缺少产品特写和利益点提示。',
      },
      {
        id: 'm1-frame-2',
        kind: 'image',
        title: '关键帧 02',
        src: '/materials/eh-weibo-frame-2.svg',
        note: '画面信息密度高，但购买驱动不足。',
      },
    ],
  },
  {
    id: 2,
    name: '功能CG视频-微信视频号版',
    type: 'CG特效视频',
    producer: '蓝色光标',
    productionCost: 420000,
    deliveryCost: 850000,
    media: '微信视频号',
    startDate: '2026-08-20',
    views: 1850000,
    completionRate: 61,
    targetCompletionRate: 75,
    positiveRatio: 68,
    negativeRatio: 14,
    targetPositiveRatio: 82,
    ctr: 0.4,
    targetCtr: 0.5,
    status: '未达预期',
    alertLevel: '中',
    aiTags: ['科技感过强', '生活场景缺失', 'CTA不清晰', '受众年龄偏差'],
    aiAnalysis: '完播率61%低于目标14个百分点，CTR 0.4%也未达约定0.5%。AI分析：CG特效视觉效果震撼，但过于强调科技属性，与微信视频号用户（偏中年、注重实用性）的内容偏好存在错位。负面评价集中在“看不懂在讲什么”和“感觉不是给我看的”。建议在CG效果基础上增加真实穿着场景，强化“保暖+轻便”的生活化表达。',
    userComments: ['特效很炫但不知道想说什么', '感觉是年轻人的东西', '没有看到实际穿着效果'],
    previewItems: [
      {
        id: 'm2-video',
        kind: 'video',
        title: '正片预览',
        poster: '/materials/cg-wechat-poster.svg',
        note: '适合对照 AI 关于“科技感过强”的诊断进行查看。',
      },
      {
        id: 'm2-frame-1',
        kind: 'image',
        title: '关键帧 01',
        src: '/materials/cg-wechat-frame-1.svg',
        note: '用户容易感知高级感，但难建立实用联想。',
      },
      {
        id: 'm2-frame-2',
        kind: 'image',
        title: '关键帧 02',
        src: '/materials/cg-wechat-frame-2.svg',
        note: '建议后续追加真实穿着镜头。',
      },
    ],
  },
  {
    id: 3,
    name: 'EH设计师访谈视频-抖音版',
    type: '品牌形象视频',
    producer: '麦肯光明',
    productionCost: 280000,
    deliveryCost: 2870000,
    media: '抖音',
    startDate: '2026-08-15',
    views: 2870000,
    completionRate: 68,
    targetCompletionRate: 78,
    positiveRatio: 74,
    negativeRatio: 12,
    targetPositiveRatio: 85,
    ctr: 1.9,
    targetCtr: 2.5,
    status: '需关注',
    alertLevel: '中',
    aiTags: ['完播率偏低', '正面评价未达标', 'CTR不足'],
    aiAnalysis: '完播率68%低于目标10个百分点，CTR 1.9%也低于约定2.5%。相比小红书版本表现明显偏弱。AI分析：抖音用户对内容节奏要求更高，当前版本剪辑节奏偏慢，建议针对抖音平台重新剪辑，突出视觉冲击帧，并优化封面图以提升点击率。',
    userComments: ['节奏有点慢', '内容还不错但不够吸引人', '比小红书那个版本差一些'],
    previewItems: [
      {
        id: 'm3-video',
        kind: 'video',
        title: '正片预览',
        poster: '/materials/eh-douyin-poster.svg',
        note: '建议结合 CTR 与完播率一起看开场镜头和封面吸引力。',
      },
      {
        id: 'm3-frame-1',
        kind: 'image',
        title: '封面图',
        src: '/materials/eh-douyin-cover.svg',
        note: '更适合做封面 AB 测试。',
      },
      {
        id: 'm3-frame-2',
        kind: 'image',
        title: '关键帧 02',
        src: '/materials/eh-douyin-frame-2.svg',
        note: '建议前置产品性能与使用场景。',
      },
    ],
  },
];

const PRODUCER_RECORDS: ProducerRecord[] = [
  {
    name: '麦肯光明',
    totalMaterials: 6,
    underperformed: 3,
    totalProductionCost: 1680000,
    totalDeliveryCost: 4820000,
    avgCompletionRate: 63,
    avgPositiveRatio: 71,
    riskLevel: '高',
    issues: ['连续2个Campaign完播率未达标', '微博版素材CTR持续低于行业均值', '创意方案交付延迟影响投放节奏'],
  },
  {
    name: '蓝色光标',
    totalMaterials: 4,
    underperformed: 1,
    totalProductionCost: 920000,
    totalDeliveryCost: 3250000,
    avgCompletionRate: 74,
    avgPositiveRatio: 79,
    riskLevel: '中',
    issues: ['微信视频号素材受众定向偏差'],
  },
  {
    name: '华扬联众',
    totalMaterials: 3,
    underperformed: 0,
    totalProductionCost: 450000,
    totalDeliveryCost: 2100000,
    avgCompletionRate: 85,
    avgPositiveRatio: 88,
    riskLevel: '低',
    issues: [],
  },
];

// ── 辅助 ──────────────────────────────────────────────────
const fmt = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(0)}万` : n.toLocaleString());
const fmtMoney = (n: number) => `¥${(n / 10000).toFixed(0)}万`;

const alertColor = (l: AlertLevel) =>
  l === '高' ? 'bg-red-100 text-red-700' : l === '中' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';

const statusColor = (s: MaterialStatus) =>
  s === '未达预期' ? 'bg-red-100 text-red-700' : s === '需关注' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';

const riskBorder = (l: AlertLevel) =>
  l === '高' ? 'border-l-4 border-red-400' : l === '中' ? 'border-l-4 border-amber-400' : 'border-l-4 border-green-400';

const deltaColor = (actual: number, target: number, higherIsBetter = true) => {
  const good = higherIsBetter ? actual >= target : actual <= target;
  return good ? 'text-green-600' : 'text-red-600';
};

// ── 主组件 ────────────────────────────────────────────────
export default function MaterialAnalysis() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'risk'>('marketing');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activePreviewByMaterial, setActivePreviewByMaterial] = useState<Record<number, string>>(
    Object.fromEntries(MATERIALS.map(material => [material.id, material.previewItems[0]?.id ?? '']))
  );
  const [lightboxPreview, setLightboxPreview] = useState<{ materialName: string; item: PreviewItem } | null>(null);

  const highRiskProducers = PRODUCER_RECORDS.filter(p => p.riskLevel === '高').length;

  return (
    <Layout title="素材分析 — 以叠变应万变">
      {/* Tab 切换 */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'marketing' ? 'bg-white text-[#002060] shadow' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fa-solid fa-film mr-2"></i>素材洞察（业务视角）
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'risk' ? 'bg-white text-[#002060] shadow' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fa-solid fa-shield-halved mr-1"></i>风险监控（风控视角）
          {highRiskProducers > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{highRiskProducers}</span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'marketing' ? (
          <motion.div key="marketing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {/* 说明栏 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-start gap-3">
              <i className="fa-solid fa-circle-info text-amber-500 mt-0.5"></i>
              <p className="text-sm text-amber-800">
                以下仅列示<span className="font-semibold">投放未达预期、负面评价偏高或完播率低</span>的素材，供业务团队重点复盘和优化参考。已支持在查看分析时同步查看素材内容，可对照正片、封面与关键帧进行判断。
              </p>
            </div>

            {/* 素材卡片列表 */}
            <div className="space-y-4">
              {MATERIALS.map(m => {
                const activePreviewId = activePreviewByMaterial[m.id] || m.previewItems[0]?.id;
                const activePreview = m.previewItems.find(item => item.id === activePreviewId) || m.previewItems[0];
                const mainPreviewSrc = activePreview.kind === 'video' ? activePreview.poster : activePreview.src;

                return (
                  <motion.div key={m.id} layout className={`bg-white rounded-xl shadow-md overflow-hidden ${riskBorder(m.alertLevel)}`}>
                    {/* 卡片头部 */}
                    <div
                      className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-gray-800">{m.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{m.type}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(m.status)}`}>{m.status}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${alertColor(m.alertLevel)}`}>风险：{m.alertLevel}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span><i className="fa-regular fa-building mr-1"></i>制作方：{m.producer}</span>
                            <span><i className="fa-solid fa-mobile-screen mr-1"></i>{m.media}</span>
                            <span><i className="fa-regular fa-calendar mr-1"></i>{m.startDate}</span>
                            <span>制作费：{fmtMoney(m.productionCost)}</span>
                            <span>投放费：{fmtMoney(m.deliveryCost)}</span>
                            <span>素材形态：{m.previewItems.some(item => item.kind === 'video') ? '视频 / 关键帧' : '图片组'}</span>
                          </div>
                        </div>
                        <div className="flex gap-6 shrink-0 text-center">
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">完播率</p>
                            <p className={`text-lg font-bold ${deltaColor(m.completionRate, m.targetCompletionRate)}`}>{m.completionRate}%</p>
                            <p className="text-xs text-gray-400">目标 {m.targetCompletionRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">正面评价</p>
                            <p className={`text-lg font-bold ${deltaColor(m.positiveRatio, m.targetPositiveRatio)}`}>{m.positiveRatio}%</p>
                            <p className="text-xs text-gray-400">目标 {m.targetPositiveRatio}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">CTR</p>
                            <p className={`text-lg font-bold ${deltaColor(m.ctr, m.targetCtr)}`}>{m.ctr}%</p>
                            <p className="text-xs text-gray-400">目标 {m.targetCtr}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">播放量</p>
                            <p className="text-lg font-bold text-gray-700">{fmt(m.views)}</p>
                          </div>
                        </div>
                        <i className={`fa-solid fa-chevron-${expandedId === m.id ? 'up' : 'down'} text-gray-400 mt-1`}></i>
                      </div>
                    </div>

                    {/* 展开详情 */}
                    <AnimatePresence>
                      {expandedId === m.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 border-t border-gray-100 pt-4 grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6">
                            {/* 左侧：素材内容预览 */}
                            <div className="bg-slate-950 rounded-2xl p-4 text-white shadow-inner">
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Creative Preview</p>
                                  <h3 className="text-base font-semibold mt-1">素材内容对照查看</h3>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
                                  {activePreview.kind === 'video' ? '视频素材' : '图片素材'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setLightboxPreview({ materialName: m.name, item: activePreview })}
                                className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 aspect-video mb-3 relative w-full text-left group"
                              >
                                {activePreview.kind === 'video' ? (
                                  activePreview.src ? (
                                    <video controls poster={activePreview.poster} className="w-full h-full object-cover bg-black">
                                      <source src={activePreview.src} />
                                    </video>
                                  ) : (
                                    <div className="relative w-full h-full">
                                      <img src={activePreview.poster} alt={activePreview.title} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                                          <i className="fa-solid fa-play text-3xl text-white ml-1"></i>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                ) : (
                                  <img src={activePreview.src} alt={activePreview.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                                  <span className="text-xs text-white/90">点击放大查看</span>
                                  <i className="fa-solid fa-up-right-and-down-left-from-center text-white/90 text-sm"></i>
                                </div>
                                <div className="absolute inset-0 ring-1 ring-white/0 group-hover:ring-white/20 transition-all pointer-events-none"></div>
                              </button>

                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                  <p className="text-sm font-medium text-white">{activePreview.title}</p>
                                  <p className="text-xs text-slate-300 mt-1">{activePreview.note}</p>
                                </div>
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">{m.previewItems.length} 个可查看节点</span>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                {m.previewItems.map(item => {
                                  const isActive = item.id === activePreview.id;
                                  const thumbSrc = item.kind === 'video' ? item.poster : item.src;

                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setActivePreviewByMaterial(prev => ({ ...prev, [m.id]: item.id }))}
                                      className={`group rounded-xl overflow-hidden border text-left transition-all ${
                                        isActive ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-white/10 hover:border-white/30'
                                      }`}
                                    >
                                      <div className="relative aspect-video bg-slate-900">
                                        {thumbSrc ? (
                                          <img src={thumbSrc} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                                        ) : (
                                          <div className="w-full h-full bg-slate-800" />
                                        )}
                                        {item.kind === 'video' && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <i className="fa-solid fa-play text-white text-sm"></i>
                                          </div>
                                        )}
                                      </div>
                                      <div className="px-2 py-2 bg-slate-900/90">
                                        <p className="text-xs font-medium text-slate-100 truncate">{item.title}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{item.kind === 'video' ? '正片/视频' : '图片/关键帧'}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 右侧：分析内容 */}
                            <div className="space-y-4">
                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-[#002060] bg-blue-50 px-2 py-0.5 rounded">
                                    <i className="fa-solid fa-robot mr-1"></i>AI 点评分析
                                  </span>
                                  <span className="text-xs text-gray-400">结合指标、评价与素材内容</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{m.aiAnalysis}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {m.aiTags.map((tag, i) => (
                                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-gray-500 mb-3">
                                  <i className="fa-solid fa-crosshairs mr-1"></i>对照查看提示
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-gray-800 font-medium mb-1">看开场</p>
                                    <p className="text-gray-600 text-xs">重点判断前 3-15 秒是否足够抓人，是否快速给出卖点。</p>
                                  </div>
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-gray-800 font-medium mb-1">看卖点</p>
                                    <p className="text-gray-600 text-xs">判断产品功能、场景、利益点是否被清晰表达。</p>
                                  </div>
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-gray-800 font-medium mb-1">看平台适配</p>
                                    <p className="text-gray-600 text-xs">判断节奏、封面、画面信息密度是否符合当前媒介习惯。</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-gray-500 mb-2">
                                  <i className="fa-regular fa-comment mr-1"></i>代表性负面用户评论
                                </p>
                                <div className="space-y-2">
                                  {m.userComments.map((c, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border-l-2 border-red-300">
                                      “{c}”
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* 跨素材洞察 */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4"><i className="fa-solid fa-lightbulb text-amber-500 mr-2"></i>跨素材共性洞察</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: 'fa-clock', color: 'text-red-500', title: '黄金3秒留存不足', desc: '多支未达标素材均在前15秒出现大量流失，开篇缺乏视觉钩子是共性问题。' },
                  { icon: 'fa-users', color: 'text-amber-500', title: '平台受众错位', desc: '品牌形象类素材在微博/微信视频号的受众与实际用户画像存在偏差，需差异化剪辑。' },
                  { icon: 'fa-tag', color: 'text-blue-500', title: '产品卖点表达弱', desc: '负面评价中“不知道在讲什么”占比高，建议所有素材在前10秒明确传递核心卖点。' },
                  { icon: 'fa-image', color: 'text-emerald-500', title: '封面与关键帧可复盘', desc: '建议把封面图、首帧、转折帧纳入标准复盘链路，和 AI 分析一并对照。' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`fa-solid ${item.icon} ${item.color}`}></i>
                      <span className="font-medium text-gray-800 text-sm">{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="risk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {/* 风控概览指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: '本Campaign素材总数', value: MATERIALS.length + 5, icon: 'fa-film', color: 'bg-blue-100 text-blue-600' },
                { label: '未达预期素材', value: MATERIALS.filter(m => m.status === '未达预期').length, icon: 'fa-circle-exclamation', color: 'bg-red-100 text-red-600' },
                { label: '涉及制作费用', value: fmtMoney(MATERIALS.reduce((s, m) => s + m.productionCost, 0)), icon: 'fa-money-bill', color: 'bg-amber-100 text-amber-600' },
                { label: '涉及投放费用', value: fmtMoney(MATERIALS.reduce((s, m) => s + m.deliveryCost, 0)), icon: 'fa-chart-bar', color: 'bg-purple-100 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-3">
                  <div className={`p-3 rounded-full ${item.color}`}><i className={`fa-solid ${item.icon}`}></i></div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-lg font-bold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 制作单位累计表现 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">制作单位累计表现</h3>
                <p className="text-xs text-gray-500 mt-0.5">跨 Campaign 统计，用于评估制作单位的持续合规性与质量风险</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['制作单位', '素材总数', '未达标数', '未达标率', '制作费合计', '投放费合计', '平均完播率', '平均正面评价', '风险等级', '主要问题'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PRODUCER_RECORDS.map((p, i) => {
                      const failRate = Math.round((p.underperformed / p.totalMaterials) * 100);
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.name}</td>
                          <td className="px-4 py-3 text-gray-600">{p.totalMaterials}</td>
                          <td className="px-4 py-3 text-gray-600">{p.underperformed}</td>
                          <td className={`px-4 py-3 font-medium ${failRate >= 40 ? 'text-red-600' : failRate >= 20 ? 'text-amber-600' : 'text-green-600'}`}>{failRate}%</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtMoney(p.totalProductionCost)}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtMoney(p.totalDeliveryCost)}</td>
                          <td className={`px-4 py-3 font-medium ${p.avgCompletionRate >= 75 ? 'text-green-600' : p.avgCompletionRate >= 65 ? 'text-amber-600' : 'text-red-600'}`}>{p.avgCompletionRate}%</td>
                          <td className={`px-4 py-3 font-medium ${p.avgPositiveRatio >= 80 ? 'text-green-600' : p.avgPositiveRatio >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{p.avgPositiveRatio}%</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${alertColor(p.riskLevel)}`}>{p.riskLevel}</span>
                          </td>
                          <td className="px-4 py-3">
                            {p.issues.length === 0 ? (
                              <span className="text-xs text-gray-400">无</span>
                            ) : (
                              <ul className="space-y-0.5">
                                {p.issues.map((issue, j) => (
                                  <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                                    <i className="fa-solid fa-circle text-red-400 text-[6px] mt-1.5 shrink-0"></i>{issue}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 费用效果比预警 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4"><i className="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>费用效果比预警</h3>
              <div className="space-y-3">
                {MATERIALS.filter(m => m.status !== '达标').map(m => {
                  const totalCost = m.productionCost + m.deliveryCost;
                  const costPerView = (totalCost / m.views).toFixed(2);
                  return (
                    <div key={m.id} className={`rounded-lg p-4 flex items-start justify-between gap-4 ${m.alertLevel === '高' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800 text-sm">{m.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${alertColor(m.alertLevel)}`}>{m.alertLevel}风险</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          制作费 {fmtMoney(m.productionCost)} + 投放费 {fmtMoney(m.deliveryCost)} = 合计 {fmtMoney(totalCost)}，
                          完播率仅 {m.completionRate}%（目标 {m.targetCompletionRate}%），
                          负面评价 {m.negativeRatio}%
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">每次播放成本</p>
                        <p className={`text-lg font-bold ${m.alertLevel === '高' ? 'text-red-600' : 'text-amber-600'}`}>¥{costPerView}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setLightboxPreview(null)}
          >
            <div className="h-full w-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-6xl bg-[#07111f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Material Lightbox</p>
                    <h3 className="text-lg font-semibold mt-1">{lightboxPreview.materialName} · {lightboxPreview.item.title}</h3>
                    <p className="text-sm text-slate-300 mt-1">{lightboxPreview.item.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxPreview(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="p-4 md:p-6 bg-slate-950">
                  <div className="rounded-2xl overflow-hidden bg-black border border-white/10 max-h-[78vh] flex items-center justify-center">
                    {lightboxPreview.item.kind === 'video' ? (
                      lightboxPreview.item.src ? (
                        <video controls autoPlay poster={lightboxPreview.item.poster} className="w-full h-full max-h-[78vh] object-contain bg-black">
                          <source src={lightboxPreview.item.src} />
                        </video>
                      ) : (
                        <img
                          src={lightboxPreview.item.poster}
                          alt={lightboxPreview.item.title}
                          className="w-full h-full max-h-[78vh] object-contain"
                        />
                      )
                    ) : (
                      <img
                        src={lightboxPreview.item.src}
                        alt={lightboxPreview.item.title}
                        className="w-full h-full max-h-[78vh] object-contain"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
