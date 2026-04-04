// 生成近12个月的数据
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  }
  
  return months;
};

// 营销投入总览数据
export const marketingExpenseOverviewData = {
  // 指标数据
  metrics: [
    {
      title: '营销费用合计',
      value: '28,563,241',
      change: '8.2%',
      isPositive: false,
      secondaryLabel: '预算执行率',
      secondaryValue: '92.4%',
      icon: 'fa-money-bill-wave',
      iconColor: 'bg-blue-100 text-[#002060]',
    },
    {
      title: '销量',
      value: '156,789',
      change: '12.5%',
      isPositive: true,
      secondaryLabel: '销量达成率',
      secondaryValue: '95.8%',
      icon: 'fa-shopping-cart',
      iconColor: 'bg-green-100 text-green-600',
    },
    {
      title: '营销费率',
      value: '18.2%',
      change: '2.3%',
      isPositive: false,
      secondaryLabel: '',
      secondaryValue: '',
      icon: 'fa-percentage',
      iconColor: 'bg-purple-100 text-purple-600',
    },
    {
      title: '集采率',
      value: '68.5%',
      change: '5.1%',
      isPositive: true,
      secondaryLabel: '',
      secondaryValue: '',
      icon: 'fa-boxes-stacked',
      iconColor: 'bg-amber-100 text-amber-600',
    },
  ],

  // 营销投入趋势数据
  trendData: getLast12Months().map((month, index) => ({
    month,
    budgetExecutionRate: 85 + Math.random() * 10,
    salesAchievementRate: 88 + Math.random() * 8,
    marketingExpenseRate: 16 + Math.random() * 4,
    marketingExpense: 20000000 + Math.random() * 15000000,
  })),

  // 营销费用分部门分布
  departmentDistribution: [
    { name: '品牌', value: 8563241 },
    { name: '抖音', value: 6500000 },
    { name: '电商', value: 5800000 },
    { name: '用户', value: 3200000 },
    { name: '零支', value: 2100000 },
    { name: '集团', value: 1800000 },
    { name: '其他', value: 600000 },
  ],

  // 营销费用分费用场景分布
  expenseScenarioDistribution: [
    { name: '零司促销费用', value: 5200000 },
    { name: '营销活动', value: 4800000 },
    { name: '平台费用', value: 4500000 },
    { name: '广告宣传', value: 7800000 },
    { name: '会员运营', value: 3200000 },
    { name: '品牌公关', value: 3063241 },
  ],

  // 广告宣传二级科目
  advertisingSubcategories: [
    { name: '梯媒', value: 1200000 },
    { name: '机场', value: 800000 },
    { name: '高铁', value: 600000 },
    { name: '集团户外', value: 500000 },
    { name: '新华社', value: 300000 },
    { name: '商圈', value: 400000 },
    { name: '互联网', value: 1500000 },
    { name: '监测', value: 200000 },
    { name: '市调', value: 150000 },
    { name: '春夏战役', value: 350000 },
    { name: '叠变战役', value: 800000 },
    { name: 'AREAL战役', value: 400000 },
    { name: 'VERTEX/泡芙战役', value: 500000 },
    { name: '极寒战役', value: 450000 },
    { name: 'CNY战役', value: 300000 },
    { name: '童装专项', value: 200000 },
    { name: '视觉创意', value: 350000 },
    { name: '自媒体平台及内容运维', value: 250000 },
    { name: '品类产品种草', value: 400000 },
    { name: '品类产品内容效果投放', value: 350000 },
    { name: '营销公关及口碑', value: 200000 },
    { name: '代言人及明星', value: 100000 },
    { name: '专业及垂类专家', value: 100000 },
  ],

  // 营销费用分投放媒介分布
  mediaDistribution: [
    { name: '大户外', value: 3500000 },
    { name: '梯媒', value: 2800000 },
    { name: '抖音站内', value: 5200000 },
    { name: '电商站内', value: 4100000 },
    { name: '小红书', value: 3800000 },
    { name: '微博', value: 2500000 },
    { name: '百度', value: 1800000 },
    { name: '微信视频号', value: 3200000 },
    { name: '其他', value: 1663241 },
  ],

  // 营销费用分产品大类分布
  productDistribution: [
    { name: '叠变', marketingExpense: 8500000, marketingExpenseRate: 18.5 },
    { name: '泡芙', marketingExpense: 6200000, marketingExpenseRate: 17.2 },
    { name: '极寒', marketingExpense: 5800000, marketingExpenseRate: 19.3 },
    { name: 'AREAL', marketingExpense: 4200000, marketingExpenseRate: 16.8 },
    { name: '新年', marketingExpense: 3863241, marketingExpenseRate: 19.0 },
  ],
};