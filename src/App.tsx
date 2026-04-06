import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PolicyDetails from "./pages/PolicyDetails";
import Services from "./pages/Services";
import Company from "./pages/Company";
import ServicesVendor from "./pages/ServicesVendor";
import ServiceDetails  from "./pages/ServiceDetails.tsx";
import PincodeServices from "./pages/PincodeServices";
import VehicleEnquiry from "./pages/VehicleEnquiry";
import Register from "@/pages/Register";
import DashboardInactive from "@/pages/DashboardInactive";
import CustomerOnboardingForm from "@/pages/CustomerOnboardingForm";
import EnquiryPage from "@/pages/EnquiryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* <BrowserRouter basename="/tommyandfurryweb"></BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/policy-details" element={<PolicyDetails />} />
          <Route path="/services-details" element={<Services />} />
          <Route path="/company-master" element={<Company />} />
          <Route path="/service-details" element={<ServiceDetails />} />
          <Route path="/pincode-services" element={<PincodeServices />} />
          <Route path="/services-vendor" element={<ServicesVendor />} />
          <Route path="/vehicle-enquiry" element={<VehicleEnquiry />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboardinactive" element={<DashboardInactive />} />
          <Route path="/onboarding" element={<CustomerOnboardingForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Login />} />
          {/* <Route path="deactivate" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
