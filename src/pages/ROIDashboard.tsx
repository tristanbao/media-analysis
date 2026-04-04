import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import TableContainer from '../components/TableContainer';
import {
  marketingEffectCampaignData,
  marketingEffectDatePresets,
  type MarketingEffectCampaign,
  type MarketingEffectSchedule,
} from '../data/marketingEffectData';

type ExpandedSchedule = MarketingEffectSchedule & {
  campaignId: string;
  campaignName: string;
  brand: string;
  category: string;
  overlapDays: number;
  totalDays: number;
};

const COLORS = {
  performance: '#f97316',
  brand: '#2563eb',
  teal: '#0f766e',
  slate: '#475569',
  gold: '#d97706',
  rose: '#e11d48',
};

const getDaysInclusive = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

const getOverlapDays = (startA: string, endA: string, startB: string, endB: string) => {
  const start = Math.max(new Date(startA).getTime(), new Date(startB).getTime());
  const end = Math.min(new Date(endA).getTime(), new Date(endB).getTime());
  if (end < start) return 0;
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const formatCurrency = (value: number) => {
  if (value >= 100000000) return `¥${(value / 100000000).toFixed(2)}亿`;
  if (value >= 10000) return `¥${(value / 10000).toFixed(1)}万`;
  return `¥${Math.round(value).toLocaleString()}`;
};

const formatNumber = (value: number) => {
  if (value >= 100000000) return `${(value / 100000000).toFixed(2)}亿`;
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return Math.round(value).toLocaleString();
};

const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      {label && <div className="mb-2 text-sm font-semibold text-slate-800">{label}</div>}
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={`${entry.name}-${index}`} className="flex items-center justify-between gap-5 text-sm">
            <span className="flex items-center gap-2 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}
            </span>
            <span className="font-medium text-slate-900">
              {typeof entry.value === 'number' ? formatNumber(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ROIDashboard() {
  const [startDate, setStartDate] = useState(marketingEffectDatePresets.defaultStart);
  const [endDate, setEndDate] = useState(marketingEffectDatePresets.defaultEnd);
  const [brandFilter, setBrandFilter] = useState('全部品牌');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const brandOptions = useMemo(
    () => ['全部品牌', ...Array.from(new Set(marketingEffectCampaignData.map((item) => item.brand)))],
    []
  );

  const applyPreset = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const scopedSchedules = useMemo<ExpandedSchedule[]>(() => {
    return marketingEffectCampaignData
      .filter((campaign) => brandFilter === '全部品牌' || campaign.brand === brandFilter)
      .flatMap((campaign) =>
        campaign.schedules
          .map((schedule) => {
            const totalDays = getDaysInclusive(schedule.start, schedule.end);
            const overlapDays = getOverlapDays(schedule.start, schedule.end, startDate, endDate);
            if (overlapDays <= 0) return null;

            const ratio = overlapDays / totalDays;
            const scaledSpend = schedule.spend * ratio;
            const scaledBudget = schedule.budget * ratio;
            const scaledImpressions = schedule.impressions * ratio;
            const scaledReach = schedule.reach * ratio;
            const scaledEngagements = schedule.engagements * ratio;
            const scaledVideoViews = schedule.videoViews * ratio;
            const scaledClicks = schedule.clicks * ratio;
            const scaledSessions = schedule.sessions * ratio;
            const scaledOrders = schedule.orders * ratio;
            const scaledRevenue = schedule.revenue * ratio;
            const scaledNewCustomers = schedule.newCustomers * ratio;

            return {
              ...schedule,
              spend: scaledSpend,
              budget: scaledBudget,
              impressions: scaledImpressions,
              reach: scaledReach,
              engagements: scaledEngagements,
              videoViews: scaledVideoViews,
              clicks: scaledClicks,
              sessions: scaledSessions,
              orders: scaledOrders,
              revenue: scaledRevenue,
              newCustomers: scaledNewCustomers,
              ctr: scaledImpressions > 0 ? (scaledClicks / scaledImpressions) * 100 : 0,
              cpm: scaledImpressions > 0 ? (scaledSpend / scaledImpressions) * 1000 : 0,
              cpa: scaledOrders > 0 ? scaledSpend / scaledOrders : 0,
              roas: scaledSpend > 0 ? scaledRevenue / scaledSpend : 0,
              cpe: scaledEngagements > 0 ? scaledSpend / scaledEngagements : 0,
              campaignId: campaign.id,
              campaignName: campaign.name,
              brand: campaign.brand,
              category: campaign.category,
              overlapDays,
              totalDays,
            };
          })
          .filter(Boolean) as ExpandedSchedule[]
      )
      .sort((a, b) => b.spend - a.spend);
  }, [brandFilter, endDate, startDate]);

  const visibleCampaigns = useMemo(() => {
    return marketingEffectCampaignData
      .filter((campaign) => brandFilter === '全部品牌' || campaign.brand === brandFilter)
      .map((campaign: MarketingEffectCampaign) => {
        const schedules = scopedSchedules.filter((item) => item.campaignId === campaign.id);
        if (!schedules.length) return null;

        const spend = schedules.reduce((sum, item) => sum + item.spend, 0);
        const revenue = schedules.reduce((sum, item) => sum + item.revenue, 0);
        const performanceSpend = schedules.filter((item) => item.type === '效果投放').reduce((sum, item) => sum + item.spend, 0);
        const performanceRevenue = schedules.filter((item) => item.type === '效果投放').reduce((sum, item) => sum + item.revenue, 0);
        const brandSpend = schedules.filter((item) => item.type === '品牌投放').reduce((sum, item) => sum + item.spend, 0);
        const assistedRevenue = schedules
          .filter((item) => item.type === '品牌投放')
          .reduce((sum, item) => sum + item.revenue * 0.45, 0);

        return {
          ...campaign,
          spend,
          revenue,
          performanceSpend,
          performanceRevenue,
          brandSpend,
          assistedRevenue,
          overallRoas: spend > 0 ? revenue / spend : 0,
          performanceRoas: performanceSpend > 0 ? performanceRevenue / performanceSpend : 0,
          assistedRoas: brandSpend > 0 ? assistedRevenue / brandSpend : 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.spend || 0) - (a?.spend || 0));
  }, [brandFilter, scopedSchedules]);

  const effectiveCampaignId = useMemo(() => {
    if (activeCampaignId && visibleCampaigns.some((item) => item?.id === activeCampaignId)) {
      return activeCampaignId;
    }
    return null;
  }, [activeCampaignId, visibleCampaigns]);

  const focusSchedules = useMemo(
    () => (effectiveCampaignId ? scopedSchedules.filter((item) => item.campaignId === effectiveCampaignId) : scopedSchedules),
    [effectiveCampaignId, scopedSchedules]
  );

  const performanceSchedules = useMemo(
    () => focusSchedules.filter((item) => item.type === '效果投放'),
    [focusSchedules]
  );

  const brandSchedules = useMemo(
    () => focusSchedules.filter((item) => item.type === '品牌投放'),
    [focusSchedules]
  );

  const performanceSummary = useMemo(() => {
    const spend = performanceSchedules.reduce((sum, item) => sum + item.spend, 0);
    const revenue = performanceSchedules.reduce((sum, item) => sum + item.revenue, 0);
    const orders = performanceSchedules.reduce((sum, item) => sum + item.orders, 0);
    const clicks = performanceSchedules.reduce((sum, item) => sum + item.clicks, 0);
    const impressions = performanceSchedules.reduce((sum, item) => sum + item.impressions, 0);
    const newCustomers = performanceSchedules.reduce((sum, item) => sum + item.newCustomers, 0);
    const sessions = performanceSchedules.reduce((sum, item) => sum + item.sessions, 0);

    return {
      spend,
      revenue,
      orders,
      clicks,
      impressions,
      newCustomers,
      sessions,
      roas: spend > 0 ? revenue / spend : 0,
      cpa: orders > 0 ? spend / orders : 0,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      cvr: clicks > 0 ? (orders / clicks) * 100 : 0,
      cac: newCustomers > 0 ? spend / newCustomers : 0,
      revenuePerSession: sessions > 0 ? revenue / sessions : 0,
    };
  }, [performanceSchedules]);

  const brandSummary = useMemo(() => {
    const spend = brandSchedules.reduce((sum, item) => sum + item.spend, 0);
    const impressions = brandSchedules.reduce((sum, item) => sum + item.impressions, 0);
    const reach = brandSchedules.reduce((sum, item) => sum + item.reach, 0);
    const engagements = brandSchedules.reduce((sum, item) => sum + item.engagements, 0);
    const videoViews = brandSchedules.reduce((sum, item) => sum + item.videoViews, 0);
    const clicks = brandSchedules.reduce((sum, item) => sum + item.clicks, 0);
    const assistedRevenue = brandSchedules.reduce((sum, item) => sum + item.revenue * 0.45, 0);
    const brandedSearchLift =
      brandSchedules.length > 0
        ? 12 + brandSchedules.reduce((sum, item) => sum + (item.impressions > 0 ? item.engagements / item.impressions : 0), 0) * 100
        : 0;

    return {
      spend,
      impressions,
      reach,
      engagements,
      videoViews,
      clicks,
      assistedRevenue,
      brandedSearchLift,
      cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
      cpe: engagements > 0 ? spend / engagements : 0,
      engagementRate: impressions > 0 ? (engagements / impressions) * 100 : 0,
      viewToEngagement: videoViews > 0 ? (engagements / videoViews) * 100 : 0,
      assistedRoas: spend > 0 ? assistedRevenue / spend : 0,
    };
  }, [brandSchedules]);

  const channelPerformanceData = useMemo(() => {
    const grouped = new Map<string, { channel: string; spend: number; revenue: number; orders: number; clicks: number; newCustomers: number }>();

    performanceSchedules.forEach((item) => {
      const current = grouped.get(item.channel) || {
        channel: item.channel,
        spend: 0,
        revenue: 0,
        orders: 0,
        clicks: 0,
        newCustomers: 0,
      };
      current.spend += item.spend;
      current.revenue += item.revenue;
      current.orders += item.orders;
      current.clicks += item.clicks;
      current.newCustomers += item.newCustomers;
      grouped.set(item.channel, current);
    });

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
        roas: item.spend > 0 ? item.revenue / item.spend : 0,
        cpa: item.orders > 0 ? item.spend / item.orders : 0,
        cac: item.newCustomers > 0 ? item.spend / item.newCustomers : 0,
        cvr: item.clicks > 0 ? (item.orders / item.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [performanceSchedules]);

  const brandEfficiencyData = useMemo(() => {
    return brandSchedules
      .map((item) => ({
        campaign: item.campaignName,
        channel: item.channel,
        spend: item.spend,
        impressions: item.impressions,
        engagements: item.engagements,
        cpm: item.impressions > 0 ? (item.spend / item.impressions) * 1000 : 0,
        cpe: item.engagements > 0 ? item.spend / item.engagements : 0,
        assistedRoas: item.spend > 0 ? (item.revenue * 0.45) / item.spend : 0,
        searchLift: 8 + (item.impressions > 0 ? (item.engagements / item.impressions) * 100 : 0) * 2.6,
      }))
      .sort((a, b) => b.assistedRoas - a.assistedRoas);
  }, [brandSchedules]);

  const conversionFunnelData = useMemo(() => {
    const impressionToClick = performanceSummary.impressions > 0 ? performanceSummary.clicks / performanceSummary.impressions : 0;
    const clickToOrder = performanceSummary.clicks > 0 ? performanceSummary.orders / performanceSummary.clicks : 0;
    const orderToNewCustomer = performanceSummary.orders > 0 ? performanceSummary.newCustomers / performanceSummary.orders : 0;

    return [
      { stage: '曝光', value: performanceSummary.impressions, ratio: 100 },
      { stage: '点击', value: performanceSummary.clicks, ratio: impressionToClick * 100 },
      { stage: '订单', value: performanceSummary.orders, ratio: clickToOrder * 100 },
      { stage: '新客', value: performanceSummary.newCustomers, ratio: orderToNewCustomer * 100 },
    ];
  }, [performanceSummary]);

  const funnelChannelBreakdown = useMemo(() => {
    const grouped = new Map<
      string,
      {
        channel: string;
        impressions: number;
        clicks: number;
        orders: number;
        newCustomers: number;
      }
    >();

    performanceSchedules.forEach((item) => {
      const current = grouped.get(item.channel) || {
        channel: item.channel,
        impressions: 0,
        clicks: 0,
        orders: 0,
        newCustomers: 0,
      };

      current.impressions += item.impressions;
      current.clicks += item.clicks;
      current.orders += item.orders;
      current.newCustomers += item.newCustomers;
      grouped.set(item.channel, current);
    });

    const channelRows = Array.from(grouped.values());

    return {
      曝光: channelRows
        .map((item) => ({ channel: item.channel, value: item.impressions }))
        .sort((a, b) => b.value - a.value),
      点击: channelRows
        .map((item) => ({ channel: item.channel, value: item.clicks }))
        .sort((a, b) => b.value - a.value),
      订单: channelRows
        .map((item) => ({ channel: item.channel, value: item.orders }))
        .sort((a, b) => b.value - a.value),
      新客: channelRows
        .map((item) => ({ channel: item.channel, value: item.newCustomers }))
        .sort((a, b) => b.value - a.value),
    };
  }, [performanceSchedules]);

  const campaignRoiData = useMemo(() => {
    return visibleCampaigns.map((campaign) => {
      const current = campaign!;
      const campaignSchedules = focusSchedules.filter((item) => item.campaignId === current.id);
      const performance = campaignSchedules.filter((item) => item.type === '效果投放');
      const brand = campaignSchedules.filter((item) => item.type === '品牌投放');
      const performanceSpend = performance.reduce((sum, item) => sum + item.spend, 0);
      const performanceRevenue = performance.reduce((sum, item) => sum + item.revenue, 0);
      const brandSpend = brand.reduce((sum, item) => sum + item.spend, 0);
      const brandAssistedRevenue = brand.reduce((sum, item) => sum + item.revenue * 0.45, 0);
      const totalOrders = performance.reduce((sum, item) => sum + item.orders, 0);
      const totalNewCustomers = performance.reduce((sum, item) => sum + item.newCustomers, 0);
      const revenueLift = performanceRevenue > 0 ? brandAssistedRevenue / performanceRevenue : 0;

      return {
        name: current.name,
        brand: current.brand,
        category: current.category,
        performanceSpend,
        performanceRevenue,
        performanceRoas: performanceSpend > 0 ? performanceRevenue / performanceSpend : 0,
        brandSpend,
        brandAssistedRevenue,
        brandAssistedRoas: brandSpend > 0 ? brandAssistedRevenue / brandSpend : 0,
        orders: totalOrders,
        newCustomers: totalNewCustomers,
        revenueLift,
      };
    });
  }, [focusSchedules, visibleCampaigns]);

  const roiScatterData = useMemo(() => {
    return channelPerformanceData.map((item) => ({
      x: item.spend,
      y: item.roas,
      z: item.orders,
      name: item.channel,
    }));
  }, [channelPerformanceData]);

  const attributionBridgeData = useMemo(() => {
    return campaignRoiData
      .filter((item) => item.brandSpend > 0 || item.performanceSpend > 0)
      .map((item) => ({
        name: item.name.replace('波司登', ''),
        ['品牌助攻回收（测算）']: Math.round(item.brandAssistedRevenue),
        ['效果直接回收']: Math.round(item.performanceRevenue),
      }))
      .sort((a, b) => b['效果直接回收'] - a['效果直接回收']);
  }, [campaignRoiData]);

  const attributionInsight = useMemo(() => {
    const richestBridge = [...campaignRoiData].sort((a, b) => b.revenueLift - a.revenueLift)[0];
    const strongestPerformance = [...campaignRoiData].sort((a, b) => b.performanceRoas - a.performanceRoas)[0];

    return {
      richestBridge,
      strongestPerformance,
    };
  }, [campaignRoiData]);

  const diagnosisCards = useMemo(() => {
    const worstCpa = [...channelPerformanceData].sort((a, b) => b.cpa - a.cpa)[0];
    const bestRoas = [...channelPerformanceData].sort((a, b) => b.roas - a.roas)[0];
    const bestBrand = [...brandEfficiencyData].sort((a, b) => b.assistedRoas - a.assistedRoas)[0];

    return [
      {
        title: '当前回收观察',
        text:
          performanceSummary.roas >= 5
            ? `当前效果投放回收效率稳定，ROAS ${performanceSummary.roas.toFixed(2)}x，可继续承担成交目标。`
            : `当前效果投放回收效率低于预期，ROAS ${performanceSummary.roas.toFixed(2)}x，建议优先检查低效渠道与转化链路。`,
        tone: 'bg-slate-900 text-white',
      },
      {
        title: '当前效果最优渠道',
        text: bestRoas ? `${bestRoas.channel} 当前 ROAS ${bestRoas.roas.toFixed(2)}x，适合继续承担核心成交预算。` : '暂无数据。',
        tone: 'bg-orange-50 text-slate-800',
      },
      {
        title: '当前需要修正',
        text: worstCpa ? `${worstCpa.channel} 当前 CPA ¥${worstCpa.cpa.toFixed(1)}，优先检查定向、出价与承接页损耗。` : '暂无数据。',
        tone: 'bg-rose-50 text-slate-800',
      },
      {
        title: '品牌测算信号',
        text: bestBrand ? `${bestBrand.channel} 助攻ROAS（测算） ${bestBrand.assistedRoas.toFixed(2)}x，可继续承担搜索抬升与心智渗透。` : '暂无数据。',
        tone: 'bg-blue-50 text-slate-800',
      },
    ];
  }, [brandEfficiencyData, channelPerformanceData, performanceSummary.roas]);

  return (
    <Layout title="ROI分析看板">
      <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_34%),radial-gradient(circle_at_82%_22%,_rgba(37,99,235,0.22),_transparent_30%),linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
              ROI in media buying
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black tracking-tight">ROI分析</h2>
              <div className="group relative">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/20"
                  aria-label="ROI分析说明"
                >
                  ?
                </button>
                <div className="pointer-events-none absolute left-0 top-8 z-20 hidden w-80 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs leading-5 text-slate-200 shadow-2xl group-hover:block">
                  用于判断效果投放回收效率、品牌投放助攻价值以及预算如何在品牌与效果之间重新分配。
                </div>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-3 md:grid-cols-3 xl:w-auto">
            <label className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="mb-1 text-xs text-slate-300">开始日期</div>
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-white outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="mb-1 text-xs text-slate-300">结束日期</div>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-white outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="mb-1 text-xs text-slate-300">品牌范围</div>
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setActiveCampaignId(null);
                }}
                className="w-full bg-transparent text-sm font-medium text-white outline-none"
              >
                {brandOptions.map((option) => (
                  <option key={option} value={option} className="text-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {marketingEffectDatePresets.quickRanges.map((range) => {
            const isActive = startDate === range.start && endDate === range.end;
            return (
              <button
                key={range.id}
                onClick={() => applyPreset(range.start, range.end)}
                className={`rounded-full px-4 py-2 text-sm transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'border border-white/15 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            {
              label: effectiveCampaignId ? '当前聚焦 Campaign' : 'ROI覆盖 Campaign 数',
              value: effectiveCampaignId
                ? `${visibleCampaigns.find((item) => item?.id === effectiveCampaignId)?.name}`
                : `${visibleCampaigns.length}`,
              sub: effectiveCampaignId ? '已切换到单 Campaign ROI 视角' : '当前筛选范围内统一汇总',
            },
            {
              label: '效果投放回收',
              value: formatCurrency(performanceSummary.revenue),
              sub: `ROAS ${performanceSummary.roas.toFixed(2)}x`,
            },
            {
              label: '品牌助攻回收（测算）',
              value: formatCurrency(brandSummary.assistedRevenue),
              sub: `助攻ROAS（测算） ${brandSummary.assistedRoas.toFixed(2)}x`,
            },
            {
              label: '品牌预算占比',
              value: formatPercent(
                performanceSummary.spend + brandSummary.spend > 0
                  ? (brandSummary.spend / (performanceSummary.spend + brandSummary.spend)) * 100
                  : 0
              ),
              sub: '用于判断前链路投资结构',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4 backdrop-blur-sm">
              <div className="text-xs text-slate-300">{item.label}</div>
              <div className="mt-1 text-2xl font-bold">{item.value}</div>
              <div className="mt-1 text-xs text-slate-300">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {effectiveCampaignId && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <div>
            当前已联动到 Campaign：
            <span className="ml-1 font-semibold">{visibleCampaigns.find((item) => item?.id === effectiveCampaignId)?.name}</span>
          </div>
          <button onClick={() => setActiveCampaignId(null)} className="rounded-full bg-white px-3 py-1 font-medium text-blue-700 shadow-sm">
            清除联动
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveCampaignId(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            !effectiveCampaignId
              ? 'bg-slate-900 text-white shadow-lg'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          全部 Campaign
        </button>
        {visibleCampaigns.map((campaign) => {
          const current = campaign!;
          const isActive = current.id === effectiveCampaignId;
          return (
            <button
              key={current.id}
              onClick={() => setActiveCampaignId(isActive ? null : current.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {current.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard title="效果投放 ROAS" value={`${performanceSummary.roas.toFixed(2)}x`} change={formatPercent(7.8)} isPositive={true} secondaryLabel="效果投放消耗" secondaryValue={formatCurrency(performanceSummary.spend)} icon="fa-bolt" iconColor="bg-orange-100 text-orange-700" />
        <StatCard title="效果投放 CPA" value={`¥${performanceSummary.cpa.toFixed(1)}`} change={formatPercent(4.6)} isPositive={false} secondaryLabel="效果投放订单" secondaryValue={formatNumber(performanceSummary.orders)} icon="fa-bullseye" iconColor="bg-rose-100 text-rose-700" />
        <StatCard title="助攻ROAS（测算）" value={`${brandSummary.assistedRoas.toFixed(2)}x`} change={formatPercent(6.2)} isPositive={true} secondaryLabel="品牌投放消耗" secondaryValue={formatCurrency(brandSummary.spend)} icon="fa-bullhorn" iconColor="bg-blue-100 text-blue-700" />
        <StatCard title="品牌搜索提升" value={formatPercent(brandSummary.brandedSearchLift)} change={formatPercent(3.4)} isPositive={true} secondaryLabel="品牌互动率" secondaryValue={formatPercent(brandSummary.engagementRate)} icon="fa-magnifying-glass-chart" iconColor="bg-sky-100 text-sky-700" />
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">ROI 诊断焦点</h3>
            <div className="group relative">
              <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="ROI诊断焦点说明">?</button>
              <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                汇总当前最值得关注的回收、低效渠道和品牌测算信号，用于快速定位预算调整重点。
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {effectiveCampaignId ? '单 Campaign 诊断模式' : '全局 ROI 诊断模式'}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {diagnosisCards.map((item) => (
            <div key={item.title} className={`rounded-[24px] p-5 shadow-md ${item.tone}`}>
              <div className="text-sm font-bold">{item.title}</div>
              <div className="mt-2 text-sm leading-6 opacity-90">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">效果回收分析</h3>
            <div className="group relative">
              <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="效果回收分析说明">?</button>
              <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                用于查看效果投放的转化漏斗、渠道回收与效率变化，是 ROI 的直接判断区。
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Performance ROI Zone
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer title="效果投放转化漏斗" helpText="展示效果投放从曝光到点击、订单、新客的逐层转化，并补充各阶段对应的渠道贡献。" className="xl:col-span-1" contentClassName="min-h-[300px]">
          <div className="flex flex-col gap-4">
            {conversionFunnelData.map((item, index) => (
              <motion.div key={item.stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{item.stage}</span>
                  <span className="text-slate-500">{item.stage === '曝光' ? '100%' : formatPercent(item.ratio)}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(item.value)}</div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.min(item.stage === '曝光' ? 100 : item.ratio, 100)}%` }}></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {funnelChannelBreakdown[item.stage as keyof typeof funnelChannelBreakdown].map((channel) => (
                    <span key={`${item.stage}-${channel.channel}`} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                      {channel.channel} · {formatNumber(channel.value)}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="效果渠道回收散点图" helpText="横轴为投放金额，纵轴为 ROAS，气泡大小代表订单量，用于识别高投入高回收或低效渠道。" className="xl:col-span-2" contentClassName="h-auto min-h-[300px]">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 24, left: 8, bottom: 36 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="投放金额"
                  tickFormatter={(value) => formatNumber(value)}
                  domain={[0, 'dataMax']}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="ROAS"
                  domain={[0, 'dataMax + 1']}
                  tickFormatter={(value) => `${value.toFixed(1)}x`}
                />
                <ZAxis type="number" dataKey="z" range={[80, 420]} name="订单量" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
                        <div className="text-sm font-semibold text-slate-800">{data.name}</div>
                        <div className="mt-1 text-sm text-slate-600">投放金额：{formatCurrency(data.x)}</div>
                        <div className="text-sm text-slate-600">ROAS：{data.y.toFixed(2)}x</div>
                        <div className="text-sm text-slate-600">订单量：{formatNumber(data.z)}</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="效果渠道" data={roiScatterData} fill={COLORS.performance}>
                  {roiScatterData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS.performance} fillOpacity={0.78} stroke="#ea580c" strokeWidth={1.5} />
                  ))}
                  <LabelList dataKey="name" position="top" offset={10} className="fill-slate-600 text-[11px] font-medium" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {roiScatterData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-800">{item.name}</div>
                <div className="mt-1">投放金额：{formatCurrency(item.x)}</div>
                <div>ROAS：{item.y.toFixed(2)}x</div>
                <div>订单量：{formatNumber(item.z)}</div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">品牌效率测算</h3>
            <div className="group relative">
              <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="品牌效率分析说明">?</button>
              <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                用于查看品牌投放的助攻回收测算、搜索抬升和内容表现，不与效果回收口径直接混算；当前站外投放缺少稳定站外到站内链路，相关回收采用模型测算口径。
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Brand Efficiency Zone
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartContainer title="效果投放 ROI / CPA 对比" helpText="同时比较渠道的回收效率与获客成本，用于判断哪些渠道适合继续承担成交预算。">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">效果回收主视图</span>
            <span className="text-xs text-slate-400">直接回收口径</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={channelPerformanceData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="channel" angle={-24} textAnchor="end" height={60} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `¥${Math.round(value)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="roas" name="ROAS" fill={COLORS.performance} radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="cpa" name="CPA" stroke={COLORS.teal} strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="品牌效率画像（测算）" helpText="查看品牌投放的助攻回收测算、搜索提升和内容效率；由于站外投放缺少稳定站外到站内链路，助攻相关指标采用模型测算口径。">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">品牌测算主视图</span>
            <span className="text-xs text-slate-400">模型测算口径</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandEfficiencyData} margin={{ top: 10, right: 20, left: 0, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="channel" angle={-24} textAnchor="end" height={70} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="assistedRoas" name="助攻ROAS（测算）" fill={COLORS.brand} radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="searchLift" name="搜索提升" stroke={COLORS.gold} strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">桥接贡献测算</h3>
            <div className="group relative">
              <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="归因桥接分析说明">?</button>
              <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                用于查看品牌投放是否对后链路成交形成带动；当前站外投放下缺少稳定用户级链路，桥接贡献采用模型测算口径。
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Attribution Bridge Zone
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer title="品牌桥接贡献（测算）" helpText="比较品牌助攻回收测算与效果直接回收，用于判断品牌投放是否有效带动后链路成交；当前桥接贡献采用模型测算口径。" className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">桥接测算视图</span>
            <span className="text-xs text-slate-400">模型测算口径</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attributionBridgeData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-18} textAnchor="end" height={64} />
              <YAxis tickFormatter={(value) => formatNumber(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="品牌助攻回收（测算）" fill={COLORS.brand} radius={[6, 6, 0, 0]} />
              <Bar dataKey="效果直接回收" fill={COLORS.performance} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="归因判断建议" helpText="汇总当前品牌助攻最强和效果收口最强的 Campaign，辅助做预算调整决策。">
          <div className="flex h-full flex-col justify-center gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-800">品牌桥接贡献最高 Campaign</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {attributionInsight.richestBridge
                  ? `${attributionInsight.richestBridge.name} 的品牌助攻回收（测算）相当于效果直接回收的 ${formatPercent(attributionInsight.richestBridge.revenueLift * 100)}，说明品牌投放对后链路成交具有较强桥接贡献。`
                  : '暂无可判断数据。'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-800">最强效果收口 Campaign</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {attributionInsight.strongestPerformance
                  ? `${attributionInsight.strongestPerformance.name} 当前效果 ROAS 为 ${attributionInsight.strongestPerformance.performanceRoas.toFixed(2)}x，适合承担预算收口与成交目标。`
                  : '暂无可判断数据。'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-800">页面使用建议</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                先用效果 ROI 判断转化达成，再用品牌助攻效率判断前链路投资是否值得继续放大，这才是媒体投放里更专业的 ROI 看法。
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
      </div>

      <TableContainer title="Campaign ROI 拆分判断" description="把同一个 campaign 拆成效果回收 ROI、品牌测算效率与桥接贡献，避免混淆口径" className="mb-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span>建议从左到右阅读：先看效果回收，再看品牌测算回收，最后判断品牌投入对成交回收的桥接价值。</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">ROI Split View</span>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Campaign', '品牌/品类', '效果投放金额', '效果回收', '效果ROAS', '品牌投放金额', '品牌助攻回收（测算）', '助攻ROAS（测算）', '桥接贡献占比（测算）', '订单', '新客'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {campaignRoiData.map((item) => (
              <tr key={item.name} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>{item.brand}</div>
                  <div>{item.category}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(item.performanceSpend)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(item.performanceRevenue)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-orange-600">{item.performanceRoas.toFixed(2)}x</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(item.brandSpend)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(item.brandAssistedRevenue)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">{item.brandAssistedRoas.toFixed(2)}x</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700">{formatPercent(item.revenueLift * 100)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatNumber(item.orders)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatNumber(item.newCustomers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer title="测算口径说明" helpText="由于小红书、微博等站外投放缺少稳定站外到站内链路，品牌相关回收与桥接贡献采用模型测算口径，主要用于预算判断。" className="xl:col-span-1">
          <div className="flex h-full flex-col justify-center gap-4">
            {[
              ['效果投放', '主看 ROAS / CPA / CVR / CAC，是直接回收和转化达成的主口径。'],
              ['品牌投放', '品牌相关回收与桥接贡献采用模型测算口径，重点看搜索提升、内容表现与后链路带动。'],
              ['桥接贡献', '站外投放缺少稳定链路时，品牌到成交的连接强度通常通过模型测算，不作为直接归因值使用。'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{text}</div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="品牌 vs 效果 投资结构" helpText="查看当前预算在品牌与效果之间的分布，用于判断前链路投入与成交收口是否均衡。" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: '效果投放', value: performanceSummary.spend, color: COLORS.performance },
                  { name: '品牌投放', value: brandSummary.spend, color: COLORS.brand },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                dataKey="value"
                paddingAngle={4}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={COLORS.performance} />
                <Cell fill={COLORS.brand} />
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Layout>
  );
}
