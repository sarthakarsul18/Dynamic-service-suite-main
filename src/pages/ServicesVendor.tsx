// pages/PolicyDetails.tsx
import ServiceVendorType from "@/components/ServiceVendorType.tsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";

const ServicesVendor = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col p-8">
      <DashboardHeader />
      <ServiceVendorType />
      <AppFooter />
    </div>
  );
};

export default ServicesVendor;
