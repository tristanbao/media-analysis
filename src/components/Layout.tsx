import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function Layout(
    {
        children,
        title
    }: LayoutProps
) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const mainMenuItems = [{
        id: "marketing-expense",
        label: "营销投入总览",
        icon: "fa-money-bill-wave"
    }, {
        id: "marketing-effect",
        label: "营销效果总览",
        icon: "fa-chart-pie"
    }, {
        id: "campaign-analysis",
        label: "以叠变应万变营销活动分析",
        icon: "fa-crosshairs"
    }, {
        id: "roi-dashboard",
        label: "ROI全景看板",
        icon: "fa-chart-line"
    }, {
        id: "media-efficiency",
        label: "媒体效率分析",
        icon: "fa-chart-bar"
    }, {
        id: "user-insight",
        label: "用户洞察中心",
        icon: "fa-users"
    }, {
        id: "optimization-engine",
        label: "优化建议引擎",
        icon: "fa-lightbulb"
    }];

    const campaignSubMenuItems = [{
        id: "supplier",
        label: "Agency分析",
        parent: "campaign-analysis"
    }, {
        id: "channel",
        label: "投放渠道分析",
        parent: "campaign-analysis"
    }, {
        id: "kol",
        label: "KOL分析",
        parent: "campaign-analysis"
    }, {
        id: "material",
        label: "素材分析",
        parent: "campaign-analysis"
    }];

    const isCampaignSubMenu = campaignSubMenuItems.some(item => location.pathname.includes(item.id));

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {}
            <motion.div
                className={`bg-[#002060] text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}
                initial={{
                    width: isSidebarOpen ? 256 : 80
                }}
                animate={{
                    width: isSidebarOpen ? 256 : 80
                }}>
                {}
                <div
                    className="p-4 flex items-center justify-between border-b border-gray-700">
                    <div
                        className={`flex items-center space-x-2 ${!isSidebarOpen && "justify-center w-full"}`}>
                        <i className="fa-solid fa-chart-line text-xl"></i>
                        {isSidebarOpen && <span className="font-bold">波司登</span>}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md hover:bg-gray-700 transition-colors">
                        <i
                            className={`fa-solid ${isSidebarOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
                    </button>
                </div>
                {}
                <div className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {mainMenuItems.map(item => {
                            const isActive = location.pathname.includes(item.id);

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => navigate(`/${item.id}`)}
                                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${isActive ? "bg-blue-800 text-white" : "hover:bg-blue-900"}`}>
                    <i className={`fa-solid ${item.icon} ${isSidebarOpen && "mr-3"}`}></i>
                    {isSidebarOpen && <span>{item.label}</span>}
                                    </button>
                                    {}
                                    {isSidebarOpen && item.id === "campaign-analysis" && <ul className="pl-10 space-y-1 mt-1">
                                        {campaignSubMenuItems.map(subItem => {
                                            const isSubActive = location.pathname.includes(subItem.id);

                                            return (
                                                <li key={subItem.id}>
                                                    <button
                                                        onClick={() => navigate(`/${subItem.parent}/${subItem.id}`)}
                                                        className={`flex items-center w-full px-4 py-2 text-left rounded-md transition-colors text-sm ${isSubActive ? "bg-blue-800 text-white" : "hover:bg-blue-900 text-gray-300"}`}>
                                                        {subItem.label}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {}
                <div
                    className={`p-4 border-t border-gray-700 ${!isSidebarOpen && "flex justify-center"}`}>
                    {isSidebarOpen ? <div className="flex items-center space-x-2">
                        <i className="fa-regular fa-user-circle"></i>
                        <span>管理员</span>
                    </div> : <i className="fa-regular fa-user-circle"></i>}
                </div>
            </motion.div>
            {}
            <div className="flex-1 flex flex-col overflow-hidden">
                {}
                <header
                    className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">当前日期: 2026-04-02</span>
                        <button
                            className="bg-[#002060] text-white px-4 py-1.5 rounded-md hover:bg-blue-900 transition-colors">
                            <i className="fa-solid fa-download mr-1"></i>导出
                                        </button>
                    </div>
                </header>
                {}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}