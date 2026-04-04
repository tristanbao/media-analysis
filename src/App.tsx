import { Routes, Route } from "react-router-dom";
import MarketingDashboard from "@/pages/MarketingDashboard";
import MarketingExpenseOverview from "@/pages/MarketingExpenseOverview";
import MarketingEffectOverview from "@/pages/MarketingEffectOverview";
import CampaignAnalysis from "@/pages/CampaignAnalysis";
import SupplierAnalysis from "@/pages/CampaignAnalysis/SupplierAnalysis";
import ChannelAnalysis from "@/pages/CampaignAnalysis/ChannelAnalysis";
import KOLAnalysis from "@/pages/CampaignAnalysis/KOLAnalysis";
import MaterialAnalysis from "@/pages/CampaignAnalysis/MaterialAnalysis";
import ROIDashboard from "@/pages/ROIDashboard";
import MediaEfficiencyAnalysis from "@/pages/MediaEfficiencyAnalysis";
import UserInsightCenter from "@/pages/UserInsightCenter";
import OptimizationEngine from "@/pages/OptimizationEngine";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingDashboard />} />
      <Route path="/marketing-expense" element={<MarketingExpenseOverview />} />
      <Route path="/marketing-effect" element={<MarketingEffectOverview />} />
      <Route path="/campaign-analysis" element={<CampaignAnalysis />} />
      <Route path="/campaign-analysis/supplier" element={<SupplierAnalysis />} />
      <Route path="/campaign-analysis/channel" element={<ChannelAnalysis />} />
      <Route path="/campaign-analysis/kol" element={<KOLAnalysis />} />
      <Route path="/campaign-analysis/material" element={<MaterialAnalysis />} />
      <Route path="/roi-dashboard" element={<ROIDashboard />} />
      <Route path="/media-efficiency" element={<MediaEfficiencyAnalysis />} />
      <Route path="/user-insight" element={<UserInsightCenter />} />
      <Route path="/optimization-engine" element={<OptimizationEngine />} />
    </Routes>
  );
}
