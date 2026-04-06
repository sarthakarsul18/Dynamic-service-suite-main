// pages/PolicyDetails.tsx
import PolicyDetailsTable from "@/components/PolicyDetailsTable.tsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";

const PolicyDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col p-8">
      <DashboardHeader />
      <PolicyDetailsTable />
      <AppFooter />
    </div>
  );
};

export default PolicyDetails;
