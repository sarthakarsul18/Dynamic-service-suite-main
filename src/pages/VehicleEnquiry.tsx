// pages/PolicyDetails.tsx
import VehicleEnquieryTable from "@/components/VehicleEnquieryTable.tsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";

const VehicleEnquiry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col p-8">
      <DashboardHeader />
      <VehicleEnquieryTable />
      <AppFooter />
    </div>
  );
};

export default VehicleEnquiry;
