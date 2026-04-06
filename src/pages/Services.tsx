// pages/PolicyDetails.tsx
import ServiceEnquiery from "@/components/ServiceEnquiery.tsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col p-8">
      <DashboardHeader />
      <ServiceEnquiery />
      <AppFooter />
    </div>
  );
};

export default Services;
