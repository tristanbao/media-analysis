import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function MarketingDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('marketing-expense');

  const handleModuleClick = (module: string) => {
    setActiveModule(module);
    navigate(`/${module}`);
  };

  return (
    <Layout title="营销分析看板">
      {/* 主内容区 */}
      <div className="container mx-auto px-4 py-8">
        {/* 第一行 - 基础分析 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">基础分析模块</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 营销投入总览卡片 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 ${
              activeModule === 'marketing-expense' ? 'border-2 border-[#002060] shadow-lg' : 'hover:shadow-lg'
            }`}
            onClick={() => handleModuleClick('marketing-expense')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">营销投入总览</h2>
                <p className="text-gray-600 text-sm mb-4">分析营销费用结构与变动趋势</p>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">费用分析</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">趋势分析</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <i className="fa-solid fa-money-bill-wave text-[#002060] text-xl"></i>
              </div>
            </div>
          </motion.div>

          {/* 营销效果总览卡片 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 ${
              activeModule === 'marketing-effect' ? 'border-2 border-[#002060] shadow-lg' : 'hover:shadow-lg'
            }`}
            onClick={() => handleModuleClick('marketing-effect')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">营销效果总览</h2>
                <p className="text-gray-600 text-sm mb-4">评估品牌声量与营销活动效果</p>
                <div className="flex space-x-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">声量分析</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">战役评估</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <i className="fa-solid fa-chart-pie text-[#00A651] text-xl"></i>
              </div>
            </div>
          </motion.div>

          {/* 以叠变应万变战役分析卡片 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 ${
              activeModule === 'campaign-analysis' ? 'border-2 border-[#002060] shadow-lg' : 'hover:shadow-lg'
            }`}
            onClick={() => handleModuleClick('campaign-analysis')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">以叠变应万变营销活动分析</h2>
                <p className="text-gray-600 text-sm mb-4">深入分析特定战役的投入产出</p>
                <div className="flex space-x-2 flex-wrap">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">供应商</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">渠道</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">KOL</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">素材</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <i className="fa-solid fa-crosshairs text-purple-600 text-xl"></i>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

        {/* 第二行 - 深度洞察 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">深度洞察模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ROI全景看板 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleModuleClick('roi-dashboard')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">ROI全景看板</h2>
                  <p className="text-gray-600 text-sm mb-4">投入产出对标分析与效率评估</p>
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">ROI分析</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">对标</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <i className="fa-solid fa-chart-line text-blue-600 text-xl"></i>
                </div>
              </div>
            </motion.div>

            {/* 媒体效率分析 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleModuleClick('media-efficiency')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">媒体效率分析</h2>
                  <p className="text-gray-600 text-sm mb-4">各媒体的CPM、CPC、CTR等效率指标</p>
                  <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">效率对比</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">趋势</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <i className="fa-solid fa-chart-bar text-green-600 text-xl"></i>
                </div>
              </div>
            </motion.div>

            {/* 用户洞察中心 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleModuleClick('user-insight')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">用户洞察中心</h2>
                  <p className="text-gray-600 text-sm mb-4">用户反馈、VOC分析与用户画像</p>
                  <div className="flex space-x-2">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">VOC分析</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">用户画像</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <i className="fa-solid fa-users text-purple-600 text-xl"></i>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 第三行 - 优化建议 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">智能优化</h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-amber-200"
            onClick={() => handleModuleClick('optimization-engine')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">✨ 优化建议引擎</h2>
                <p className="text-gray-600 text-sm mb-4">基于数据分析的智能化优化建议，帮助你快速发现问题、优化策略、提升ROI</p>
                <div className="flex space-x-2 flex-wrap">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">6个紧急建议</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">预期ROI +12.5%</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">节省成本¥250万</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <i className="fa-solid fa-lightbulb text-amber-600 text-2xl"></i>
              </div>
            </div>
          </motion.div>
        </div>
    </div>
    </Layout>
  );
}