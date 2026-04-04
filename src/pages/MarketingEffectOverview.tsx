import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  type PlacementType,
} from '../data/marketingEffectData';

type ExpandedSchedule = MarketingEffectSchedule & {
  campaignId: string;
  campaignName: string;
  brand: string;
  category: string;
  overlapDays: number;
  totalDays: number;
  budgetShare: number;
  spendProgress: number;
};

const brandColors = {
  品牌投放: '#1d4ed8',
  效果投放: '#f97316',
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
  return `¥${value.toLocaleString()}`;
};

const formatNumber = (value: number) => {
  if (value >= 100000000) return `${(value / 100000000).toFixed(2)}亿`;
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return Math.round(value).toLocaleString();
};

const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

const TooltipCard = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

    return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
      <div className="mb-2 text-sm font-semibold text-slate-800">{label}</div>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={`${entry.name}-${index}`} className="flex items-center justify-between gap-4 text-sm">
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

const TypePill = ({ type }: { type: PlacementType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      type === '品牌投放' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
    }`}
  >
    {type}
  </span>
);

export default function MarketingEffectOverview() {
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
              completionRate: schedule.completionRate,
              campaignId: campaign.id,
              campaignName: campaign.name,
              brand: campaign.brand,
              category: campaign.category,
              overlapDays,
              totalDays,
              budgetShare: scaledBudget > 0 ? scaledSpend / scaledBudget : 0,
              spendProgress: schedule.budget > 0 ? scaledSpend / schedule.budget : 0,
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
        const budget = schedules.reduce((sum, item) => sum + item.budget, 0);
        const revenue = schedules.reduce((sum, item) => sum + item.revenue, 0);
        const impressions = schedules.reduce((sum, item) => sum + item.impressions, 0);
        const orders = schedules.reduce((sum, item) => sum + item.orders, 0);
        const newCustomers = schedules.reduce((sum, item) => sum + item.newCustomers, 0);
        const brandSpend = schedules.filter((item) => item.type === '品牌投放').reduce((sum, item) => sum + item.spend, 0);
        const performanceSpend = schedules.filter((item) => item.type === '效果投放').reduce((sum, item) => sum + item.spend, 0);

        return {
          ...campaign,
          scheduleCount: schedules.length,
          spend,
          budget,
          revenue,
          impressions,
          orders,
          newCustomers,
          brandSpend,
          performanceSpend,
          budgetRate: budget > 0 ? spend / budget : 0,
          roas: spend > 0 ? revenue / spend : 0,
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

  const totals = useMemo(() => {
    const totalSpend = focusSchedules.reduce((sum, item) => sum + item.spend, 0);
    const totalBudget = focusSchedules.reduce((sum, item) => sum + item.budget, 0);
    const totalRevenue = focusSchedules.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = focusSchedules.reduce((sum, item) => sum + item.orders, 0);
    const totalImpressions = focusSchedules.reduce((sum, item) => sum + item.impressions, 0);
    const totalReach = focusSchedules.reduce((sum, item) => sum + item.reach, 0);
    const totalEngagements = focusSchedules.reduce((sum, item) => sum + item.engagements, 0);
    const totalVideoViews = focusSchedules.reduce((sum, item) => sum + item.videoViews, 0);
    const totalClicks = focusSchedules.reduce((sum, item) => sum + item.clicks, 0);
    const totalNewCustomers = focusSchedules.reduce((sum, item) => sum + item.newCustomers, 0);

    const brandSchedules = focusSchedules.filter((item) => item.type === '品牌投放');
    const performanceSchedules = focusSchedules.filter((item) => item.type === '效果投放');

    const brandSpend = brandSchedules.reduce((sum, item) => sum + item.spend, 0);
    const performanceSpend = performanceSchedules.reduce((sum, item) => sum + item.spend, 0);
    const brandImpressions = brandSchedules.reduce((sum, item) => sum + item.impressions, 0);
    const brandReach = brandSchedules.reduce((sum, item) => sum + item.reach, 0);
    const brandEngagements = brandSchedules.reduce((sum, item) => sum + item.engagements, 0);
    const brandVideoViews = brandSchedules.reduce((sum, item) => sum + item.videoViews, 0);
    const performanceRevenue = performanceSchedules.reduce((sum, item) => sum + item.revenue, 0);
    const performanceOrders = performanceSchedules.reduce((sum, item) => sum + item.orders, 0);
    const performanceClicks = performanceSchedules.reduce((sum, item) => sum + item.clicks, 0);
    const performanceNewCustomers = performanceSchedules.reduce((sum, item) => sum + item.newCustomers, 0);

    return {
      totalSpend,
      totalBudget,
      totalRevenue,
      totalOrders,
      totalImpressions,
      totalReach,
      totalEngagements,
      totalVideoViews,
      totalClicks,
      totalNewCustomers,
      budgetRate: totalBudget > 0 ? totalSpend / totalBudget : 0,
      overallRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      overallCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      brandSpend,
      performanceSpend,
      brandImpressions,
      brandReach,
      brandEngagements,
      brandVideoViews,
      performanceRevenue,
      performanceOrders,
      performanceClicks,
      performanceNewCustomers,
      brandShare: totalSpend > 0 ? brandSpend / totalSpend : 0,
      performanceShare: totalSpend > 0 ? performanceSpend / totalSpend : 0,
      brandCpm: brandImpressions > 0 ? (brandSpend / brandImpressions) * 1000 : 0,
      brandEngagementRate: brandImpressions > 0 ? (brandEngagements / brandImpressions) * 100 : 0,
      brandAvgReach: brandSchedules.length > 0 ? brandReach / brandSchedules.length : 0,
      performanceRoas: performanceSpend > 0 ? performanceRevenue / performanceSpend : 0,
      performanceCpa: performanceOrders > 0 ? performanceSpend / performanceOrders : 0,
      performanceCvr: performanceClicks > 0 ? (performanceOrders / performanceClicks) * 100 : 0,
    };
  }, [focusSchedules]);

  const pacingSummary = useMemo(() => {
    const anchor = new Date(marketingEffectDatePresets.pacingAnchorDate).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const boundedAnchor = Math.min(Math.max(anchor, start), end);
    const elapsedDays = Math.floor((boundedAnchor - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const elapsedRatio = totalDays > 0 ? elapsedDays / totalDays : 0;
    const expectedSpend = totals.totalBudget * elapsedRatio;
    const gap = totals.totalSpend - expectedSpend;
    const status = gap > totals.totalBudget * 0.05 ? '超配' : gap < -totals.totalBudget * 0.05 ? '欠配' : '正常';
    const forecastSpend = elapsedRatio > 0 ? totals.totalSpend / elapsedRatio : totals.totalSpend;
    const brandReachTarget = totals.brandReach * 1.12;
    const performanceOrdersTarget = totals.performanceOrders * 1.1;

    return {
      elapsedDays,
      totalDays,
      elapsedRatio,
      expectedSpend,
      gap,
      status,
      forecastSpend,
      monthEndCompletion: totals.totalBudget > 0 ? forecastSpend / totals.totalBudget : 0,
      brandReachTarget,
      brandReachGap: brandReachTarget - totals.brandReach,
      performanceOrdersTarget,
      performanceOrdersGap: performanceOrdersTarget - totals.performanceOrders,
    };
  }, [endDate, startDate, totals]);

  const campaignSpendData = useMemo(
    () =>
      visibleCampaigns.map((item) => ({
        name: item!.name.replace('波司登', ''),
        品牌投放: Math.round(item!.brandSpend),
        效果投放: Math.round(item!.performanceSpend),
      })),
    [visibleCampaigns]
  );

  const typeSplitData = useMemo(
    () => [
      { name: '品牌投放', value: Math.round(totals.brandSpend), color: brandColors['品牌投放'] },
      { name: '效果投放', value: Math.round(totals.performanceSpend), color: brandColors['效果投放'] },
    ],
    [totals.brandSpend, totals.performanceSpend]
  );

  const trendData = useMemo(() => {
    const map = new Map<string, { month: string; spend: number; revenue: number; impressions: number; orders: number }>();

    focusSchedules.forEach((item) => {
      const month = item.start.slice(0, 7).replace('-', '/');
      const current = map.get(month) || { month, spend: 0, revenue: 0, impressions: 0, orders: 0 };
      current.spend += item.spend;
      current.revenue += item.revenue;
      current.impressions += item.impressions;
      current.orders += item.orders;
      map.set(month, current);
    });

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [focusSchedules]);

  const channelBreakdown = useMemo(() => {
    const map = new Map<string, { channel: string; spend: number; revenue: number; impressions: number; orders: number }>();
    focusSchedules.forEach((item) => {
      const current = map.get(item.channel) || { channel: item.channel, spend: 0, revenue: 0, impressions: 0, orders: 0 };
      current.spend += item.spend;
      current.revenue += item.revenue;
      current.impressions += item.impressions;
      current.orders += item.orders;
      map.set(item.channel, current);
    });

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        roas: item.spend > 0 ? item.revenue / item.spend : 0,
        cpa: item.orders > 0 ? item.spend / item.orders : 0,
      }))
      .sort((a, b) => b.spend - a.spend);
  }, [focusSchedules]);

  const diagnostics = useMemo(() => {
    const overBudget = focusSchedules.filter((item) => item.budgetShare > 0.9).sort((a, b) => b.budgetShare - a.budgetShare);
    const lowRoas = focusSchedules.filter((item) => item.type === '效果投放' && item.roas < 4).sort((a, b) => a.roas - b.roas);
    const lowEngagement = focusSchedules
      .filter((item) => item.type === '品牌投放' && item.impressions > 0 && item.engagements / item.impressions < 0.03)
      .sort((a, b) => a.engagements / a.impressions - b.engagements / b.impressions);

    return { overBudget, lowRoas, lowEngagement };
  }, [focusSchedules]);

  return (
    <Layout title="投放效果总览">
      <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.22),_transparent_32%),radial-gradient(circle_at_85%_20%,_rgba(249,115,22,0.18),_transparent_28%),linear-gradient(135deg,_#0f172a_0%,_#172554_38%,_#1e293b_100%)] p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs tracking-[0.24em] text-slate-200 uppercase">
              Campaign-centric Monitoring
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black tracking-tight">投放效果总览</h2>
              <div className="group relative">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/20"
                  aria-label="投放效果总览说明"
                >
                  ?
                </button>
                <div className="pointer-events-none absolute left-0 top-8 z-20 hidden w-72 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs leading-5 text-slate-200 shadow-2xl group-hover:block">
                  用于查看投放运行状态、预算节奏、Campaign 结构与异常风险，适合日常监控和问题排查。
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
            { label: effectiveCampaignId ? '当前聚焦 Campaign' : '在投 Campaign 数', value: effectiveCampaignId ? `${visibleCampaigns.find((item) => item?.id === effectiveCampaignId)?.name}` : `${visibleCampaigns.length}`, sub: effectiveCampaignId ? '已进入单 Campaign 联动视图' : '跨品牌/品类统一汇总' },
            { label: '涉及品类', value: `${new Set(visibleCampaigns.map((item) => item!.category)).size}`, sub: '按时间区间动态筛选' },
            { label: effectiveCampaignId ? '联动排期数量' : '排期数量', value: `${focusSchedules.length}`, sub: '支持品牌/效果双类型拆分' },
            { label: '预算执行率', value: formatPercent(totals.budgetRate * 100), sub: '用于监控 pacing 健康度' },
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

      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="总投放金额" value={formatCurrency(totals.totalSpend)} change={formatPercent(totals.budgetRate * 100)} isPositive={totals.budgetRate <= 0.95} secondaryLabel="累计预算" secondaryValue={formatCurrency(totals.totalBudget)} icon="fa-sack-dollar" iconColor="bg-sky-100 text-sky-700" />
        <StatCard title="品牌投放金额" value={formatCurrency(totals.brandSpend)} change={formatPercent(totals.brandShare * 100)} isPositive={true} secondaryLabel="品牌 CPM" secondaryValue={`¥${totals.brandCpm.toFixed(1)}`} icon="fa-bullhorn" iconColor="bg-blue-100 text-blue-700" />
        <StatCard title="效果投放金额" value={formatCurrency(totals.performanceSpend)} change={formatPercent(totals.performanceShare * 100)} isPositive={true} secondaryLabel="效果 ROAS" secondaryValue={`${totals.performanceRoas.toFixed(2)}x`} icon="fa-bolt" iconColor="bg-orange-100 text-orange-700" />
        <StatCard title="成交产出" value={formatCurrency(totals.totalRevenue)} change={`${totals.overallRoas.toFixed(2)}x`} isPositive={totals.overallRoas >= 4} secondaryLabel="总订单数" secondaryValue={formatNumber(totals.totalOrders)} icon="fa-chart-line" iconColor="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">预算 pacing / KPI 预警</h3>
            <p className="mt-1 text-sm text-slate-500">让投放监控不仅看结果，还看过程中的偏航、缺口与月末预测</p>
          </div>
          <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            pacingSummary.status === '超配' ? 'bg-rose-100 text-rose-700' : pacingSummary.status === '欠配' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            当前状态：{pacingSummary.status}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {[
            ['今日应花', formatCurrency(pacingSummary.expectedSpend), '按时间进度折算预算'],
            ['实际已花', formatCurrency(totals.totalSpend), '时间区间累计消耗'],
            ['预算偏差', `${pacingSummary.gap >= 0 ? '+' : '-'}${formatCurrency(Math.abs(pacingSummary.gap))}`, pacingSummary.gap >= 0 ? '消耗快于计划' : '消耗慢于计划'],
            ['月末完成度', formatPercent(pacingSummary.monthEndCompletion * 100), '按当前 pacing 预测'],
          ].map(([title, value, sub]) => (
            <div key={title} className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="text-xs text-slate-500">{title}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-xs text-slate-500">{sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-blue-50/60 p-4">
            <div className="text-sm font-semibold text-slate-800">品牌投放触达缺口</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(Math.max(pacingSummary.brandReachGap, 0))}</div>
            <div className="mt-1 text-sm text-slate-600">目标触达 {formatNumber(pacingSummary.brandReachTarget)}，当前 {formatNumber(totals.brandReach)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-orange-50/70 p-4">
            <div className="text-sm font-semibold text-slate-800">效果投放转化缺口</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(Math.max(pacingSummary.performanceOrdersGap, 0))}</div>
            <div className="mt-1 text-sm text-slate-600">目标订单 {formatNumber(pacingSummary.performanceOrdersTarget)}，当前 {formatNumber(totals.performanceOrders)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-800">建议动作</div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
              <li>• 若超配：优先收缩低 ROAS 电商排期，保护核心爆发日。</li>
              <li>• 若欠配：优先加量高 ROAS / 高互动渠道，避免预算后置。</li>
              <li>• 同步关注品牌心智与转化承接，避免单侧优化。</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-6">
        <ChartContainer title="投放结构：品牌 vs 效果" helpText="查看品牌投放与效果投放的预算占比，用于判断当前投放结构是否均衡。" className="xl:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeSplitData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} dataKey="value" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {typeSplitData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Campaign 金额与类型构成" helpText="对比各 Campaign 在品牌投放与效果投放上的金额拆分，点击后可联动查看下方明细。" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignSpendData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => formatNumber(value)} />
              <Tooltip content={<TooltipCard />} />
              <Legend />
              <Bar dataKey="品牌投放" stackId="a" fill={brandColors['品牌投放']} radius={[8, 8, 0, 0]} />
              <Bar dataKey="效果投放" stackId="a" fill={brandColors['效果投放']} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <TableContainer title="时间段内 Campaign 清单" description="点击某一行后，排期明细、渠道效率、风险雷达会联动至该 Campaign" className="mb-6">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Campaign', '品牌', '品类', '阶段', '排期数', '投放金额', '品牌/效果拆分', '预算执行率', '成交金额', 'ROAS', '新客数'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{head}</th>
              ))}
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleCampaigns.map((campaign) => {
              const isActive = effectiveCampaignId === campaign!.id;
              return (
                <tr
                  key={campaign!.id}
                  className={`cursor-pointer transition-all ${isActive ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : 'hover:bg-slate-50'}`}
                  onClick={() => setActiveCampaignId((prev) => (prev === campaign!.id ? null : campaign!.id))}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{campaign!.name}</div>
                    <div className="mt-1 text-xs text-slate-500">负责人：{campaign!.owner}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{campaign!.brand}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{campaign!.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{campaign!.stage}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{campaign!.scheduleCount}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{formatCurrency(campaign!.spend)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>品牌：{formatCurrency(campaign!.brandSpend)}</div>
                    <div>效果：{formatCurrency(campaign!.performanceSpend)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm"><span className={`font-semibold ${campaign!.budgetRate > 0.95 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatPercent(campaign!.budgetRate * 100)}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(campaign!.revenue)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{campaign!.roas.toFixed(2)}x</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatNumber(campaign!.newCustomers)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableContainer>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 mb-6">
        <ChartContainer title="时间区间内投放趋势" helpText="查看当前筛选范围内的投放金额、成交金额与曝光变化，用于观察节奏是否稳定。" className="xl:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatNumber(value)} />
              <Tooltip content={<TooltipCard />} />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" name="投放金额" fill="#0f766e" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="成交金额" stroke="#f97316" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="impressions" name="曝光量" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="xl:col-span-2 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">专业监控建议</h3>
              <div className="group relative">
                <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="专业监控建议说明">?</button>
                <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                  汇总当前预算节奏、品牌触达和转化效率的观察结论，用于支持日常运营动作。
                </div>
              </div>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">实时观察</div>
          </div>
          <div className="space-y-3">
            {[
              {
                title: '预算 pacing',
                text: totals.budgetRate > 0.9 ? '当前预算执行率偏高，建议优先排查高消耗低回收排期，控制后半段预算挤兑。' : '当前预算执行率处于健康区间，可结合节点节奏逐步加量。',
              },
              {
                title: '品牌心智质量',
                text: `品牌投放平均千次曝光成本 ${totals.brandCpm.toFixed(1)} 元，互动率 ${formatPercent(totals.brandEngagementRate)}，建议联合高互动内容位提升有效触达。`,
              },
              {
                title: '转化效率',
                text: `效果投放 ROAS ${totals.performanceRoas.toFixed(2)}x，CPA ¥${totals.performanceCpa.toFixed(1)}，适合继续向高转化电商渠道倾斜预算。`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">品牌投放 KPI</h3>
              <div className="group relative">
                <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="品牌投放KPI说明">?</button>
                <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                  品牌投放更适合关注曝光、触达、互动和内容完成质量，用于判断前链路种草表现。
                </div>
              </div>
            </div>
            <TypePill type="品牌投放" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['曝光量', formatNumber(totals.brandImpressions)],
              ['触达人数', formatNumber(totals.brandReach)],
              ['互动量', formatNumber(totals.brandEngagements)],
              ['互动率', formatPercent(totals.brandEngagementRate)],
              ['视频播放', formatNumber(totals.brandVideoViews)],
              ['平均单排期触达', formatNumber(totals.brandAvgReach)],
            ].map(([label, value]) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="rounded-2xl bg-blue-50 px-4 py-4">
                <div className="text-xs text-blue-600">{label}</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">效果投放 KPI</h3>
              <div className="group relative">
                <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700" aria-label="效果投放KPI说明">?</button>
                <div className="pointer-events-none absolute left-0 top-7 z-20 hidden w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-xl group-hover:block">
                  效果投放更适合关注点击、订单、新客、CVR 和 CPA，用于判断直接转化效率。
                </div>
              </div>
            </div>
            <TypePill type="效果投放" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['点击量', formatNumber(totals.performanceClicks)],
              ['CTR', formatPercent(totals.overallCtr)],
              ['订单数', formatNumber(totals.performanceOrders)],
              ['新客数', formatNumber(totals.performanceNewCustomers)],
              ['CVR', formatPercent(totals.performanceCvr)],
              ['CPA', `¥${totals.performanceCpa.toFixed(1)}`],
            ].map(([label, value]) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="rounded-2xl bg-orange-50 px-4 py-4">
                <div className="text-xs text-orange-600">{label}</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <TableContainer title="排期级别投放明细" description={effectiveCampaignId ? '当前仅展示所选 Campaign 的排期明细' : '按投放类型区分 KPI 口径，适合排查费用结构、预算占比和单排期效率'} className="mb-6">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Campaign / 排期', '类型', '渠道', '投放目标', '时间范围', '投放金额', '预算占比', '曝光/点击', '品牌 KPI', '效果 KPI'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {focusSchedules.map((item) => (
              <tr key={item.id} className="align-top transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{item.campaignName}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.category}</div>
                </td>
                <td className="px-4 py-3"><TypePill type={item.type} /></td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.channel}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.objective}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>{item.start} ~ {item.end}</div>
                  <div className="mt-1 text-xs text-slate-400">本次统计覆盖 {item.overlapDays} / {item.totalDays} 天</div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{formatCurrency(item.spend)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-semibold text-slate-900">{formatPercent(item.budgetShare * 100)}</div>
                  <div className="mt-1 h-2 w-28 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${item.budgetShare > 0.95 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(item.budgetShare * 100, 100)}%` }}></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>曝光：{formatNumber(item.impressions)}</div>
                  <div>点击：{formatNumber(item.clicks)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>触达：{formatNumber(item.reach)}</div>
                  <div>互动率：{formatPercent(item.impressions > 0 ? (item.engagements / item.impressions) * 100 : 0)}</div>
                  <div>完播率：{formatPercent(item.completionRate)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>订单：{formatNumber(item.orders)}</div>
                  <div>CPA：¥{item.cpa.toFixed(1)}</div>
                  <div>ROAS：{item.roas.toFixed(2)}x</div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
      </TableContainer>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer title="渠道效率对比" helpText="对比各渠道的投放金额、ROAS 与 CPA，用于识别需要优化或放量的渠道。" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelBreakdown} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<TooltipCard />} />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" name="投放金额" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="roas" name="ROAS" stroke="#f97316" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="cpa" name="CPA" stroke="#059669" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">风险雷达</h3>
            <p className="mt-1 text-sm text-slate-500">帮助运营快速定位异常 campaign / 排期</p>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">预算过快消耗</span>
                <span className="rounded-full bg-rose-50 px-2 py-1 text-xs text-rose-600">{diagnostics.overBudget.length} 个</span>
              </div>
              <div className="space-y-2">
                {diagnostics.overBudget.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-rose-50 px-3 py-2 text-slate-600">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div>预算执行率 {formatPercent(item.budgetShare * 100)}，所属 {item.campaignName}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">低 ROAS 效果排期</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-600">{diagnostics.lowRoas.length} 个</span>
              </div>
              <div className="space-y-2">
                {diagnostics.lowRoas.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-amber-50 px-3 py-2 text-slate-600">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div>ROAS {item.roas.toFixed(2)}x，建议检查定向与承接页效率</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-800">低互动品牌排期</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{diagnostics.lowEngagement.length} 个</span>
              </div>
              <div className="space-y-2">
                {diagnostics.lowEngagement.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-600">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div>互动率 {formatPercent(item.impressions > 0 ? (item.engagements / item.impressions) * 100 : 0)}，建议优化内容素材与达人匹配</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
