import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Heart, 
  Stethoscope, 
  Scissors, 
  Shield, 
  Building2, 
  Pill, 
  Plus,
  TrendingUp,
  Users,
  Clock,
  Loader2,
  X,
  Car,
  Home,
  Briefcase,
  Bike,
  Plane,
  Activity,
  Trash2,
  LayoutGrid
} from "lucide-react";

const ICON_OPTIONS = [
  { label: "Shield", value: "Shield", icon: Shield },
  { label: "Heart", value: "Heart", icon: Heart },
  { label: "Stethoscope", value: "Stethoscope", icon: Stethoscope },
  { label: "Scissors", value: "Scissors", icon: Scissors },
  { label: "Building", value: "Building2", icon: Building2 },
  { label: "Pill", value: "Pill", icon: Pill },
  { label: "Car", value: "Car", icon: Car },
  { label: "Home", value: "Home", icon: Home },
  { label: "Briefcase", value: "Briefcase", icon: Briefcase },
  { label: "Bike", value: "Bike", icon: Bike },
  { label: "Plane", value: "Plane", icon: Plane },
  { label: "Activity", value: "Activity", icon: Activity },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Heart, Stethoscope, Scissors, Building2, Pill, Car, Home, Briefcase, Bike, Plane, Activity, LayoutGrid
};

const initialServices = [
  { id: 0, name: "All Leads", icon: "LayoutGrid", description: "View all registered service vendors across all categories", activeClients: 3645, monthlyGrowth: 12, revenue: "₹7,89,980", status: "active", color: "primary", type: "all" },
  { id: 1, name: "Pet Insurance", icon: "Shield", description: "Comprehensive insurance coverage for pets", activeClients: 1834, monthlyGrowth: 15, revenue: "₹2,45,890", status: "active", color: "primary", type: "Veterinary Consultations" },
  { id: 2, name: "Veterinary Services", icon: "Stethoscope", description: "Professional veterinary care and consultation", activeClients: 567, monthlyGrowth: 8, revenue: "₹1,23,450", status: "active", color: "success", type: "Veterinary Consultations" },
  { id: 3, name: "Pet Grooming", icon: "Scissors", description: "Professional grooming and styling services", activeClients: 423, monthlyGrowth: 23, revenue: "₹87,650", status: "active", color: "accent", type: "Grooming" },
  { id: 4, name: "Pet Hospital", icon: "Building2", description: "24/7 emergency and critical care", activeClients: 234, monthlyGrowth: 12, revenue: "₹98,760", status: "active", color: "warning", type: "Veterinary Consultations" },
  { id: 5, name: "Medical Shops", icon: "Pill", description: "Pet medications and health products", activeClients: 156, monthlyGrowth: 5, revenue: "₹45,230", status: "pending", color: "secondary", type: "Pet Food Sales" },
  { id: 6, name: "Pet Hostel", icon: "Heart", description: "Boarding and daycare services", activeClients: 89, monthlyGrowth: -2, revenue: "₹32,450", status: "review", color: "destructive", type: "Boarding" },
  { id: 7, name: "POSP Agents", icon: "Briefcase", description: "Point of Sales Person - Insurance agents", activeClients: 342, monthlyGrowth: 28, revenue: "₹1,56,780", status: "active", color: "primary", type: "posp_agents" },
];

const API_BASE = "https://collectkart.docboyz.in/api";
const STORAGE_KEY = "custom_services_v1";

export const ServiceManagement = () => {
  const navigate = useNavigate();
  const [loadingServiceId, setLoadingServiceId] = useState(null);
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "Shield", type: "" });
  const [saving, setSaving] = useState(false);

  // Fetch custom services from backend on mount
  useEffect(() => {
    axios.get(`${API_BASE}/dashboard-services`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setCustomServices(data);
        // also cache locally as fallback
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
      })
      .catch(() => {
        // fallback to localStorage if API fails
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setCustomServices(JSON.parse(stored));
        } catch {}
      });
  }, []);

  const services = [...initialServices, ...customServices];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending": return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "review": return <Badge variant="destructive">Under Review</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleServiceClick = async (service) => {
    try {
      setLoadingServiceId(service.id);

      if (service.type === "all") {
        const resp = await axios.get("https://collectkart.docboyz.in/api/get-all-users");
        const rows = Array.isArray(resp.data) ? resp.data : (resp.data.data || []);
        navigate("/services-vendor", { state: { rows, category: "All", tableType: "services" } });
      } else if (service.type === "posp_agents") {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const resp = await axios.post("https://collectkart.docboyz.in/api/agentsdata", {
          id: parsedUser?.id ?? null,
        });
        const rows = Array.isArray(resp.data) ? resp.data : (resp.data.agents || resp.data.data || []);
        navigate("/services-vendor", { state: { rows, category: "POSP Agents", tableType: "agents" } });
      } else {
        const resp = await axios.post("https://collectkart.docboyz.in/api/service_vender_data", {
          category: service.type
        });
        const rows = Array.isArray(resp.data) ? resp.data : (resp.data.data || []);
        navigate("/services-vendor", { state: { rows, category: service.type, tableType: "services" } });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch service data (check backend).");
    } finally {
      setLoadingServiceId(null);
    }
  };

  const handleAddService = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || `${form.name.trim()} services`,
      icon: form.icon,
      type: form.type.trim() || form.name.trim(),
    };
    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE}/dashboard-services`, payload);
      const saved = res.data.data || { ...payload, id: Date.now(), activeClients: 0, monthlyGrowth: 0, revenue: "₹0", status: "active" };
      const updated = [...customServices, saved];
      setCustomServices(updated);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      setForm({ name: "", description: "", icon: "Shield", type: "" });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/dashboard-services/${id}`);
    } catch (err) {
      console.error(err);
    }
    const updated = customServices.filter((s) => s.id !== id);
    setCustomServices(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Manage all Insurance services across your platform</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => navigate("/pincode-services")}><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Pincode Wise Services</p><p className="text-2xl font-bold">{services.length}</p></div><Heart className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card className="bg-gradient-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Active Clients</p><p className="text-2xl font-bold">{services.reduce((sum, s) => sum + (s.activeClients ?? 0), 0).toLocaleString()}</p></div><Users className="w-8 h-8 text-success" /></div></CardContent></Card>
        <Card className="bg-gradient-card" onClick={() => navigate("/service-details")}><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Service Details</p><p className="text-2xl font-bold"></p></div><TrendingUp className="w-8 h-8 text-accent" /></div></CardContent></Card>
        <Card className="bg-gradient-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Avg Growth</p><p className="text-2xl font-bold">+10.2%</p></div><Clock className="w-8 h-8 text-warning" /></div></CardContent></Card>
      </div>

      {/* services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComp = ICON_MAP[service.icon] || Shield;
          return (
            <Card
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`bg-gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer ${loadingServiceId === service.id ? "opacity-80" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <IconComp className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Active Clients</p><p className="text-xl font-bold">{(service.activeClients ?? 0).toLocaleString()}</p></div>
                  <div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-xl font-bold">{service.revenue ?? "₹0"}</p></div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Monthly Growth</span>
                    <span className={(service.monthlyGrowth ?? 0) >= 0 ? "text-success" : "text-destructive"}>{(service.monthlyGrowth ?? 0) >= 0 ? "+" : ""}{service.monthlyGrowth ?? 0}%</span>
                  </div>
                  <Progress value={Math.abs(service.monthlyGrowth ?? 0)} className="h-2" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>View Details</Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>Configure</Button>
                  {loadingServiceId === service.id && <div className="ml-2 flex items-center"><Loader2 className="animate-spin w-5 h-5" /></div>}
                  {customServices.some((cs) => cs.id === service.id) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(service.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Add New Service</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white text-xl font-bold leading-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Motor Insurance"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Brief description of this service"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Motor, Health, Life"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map(({ value, icon: IconComp }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, icon: value })}
                      className={`p-2 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        form.icon === value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${form.icon === value ? "text-blue-600" : "text-gray-500"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button
                onClick={handleAddService}
                disabled={!form.name.trim() || saving}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirm Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Service</h3>
              <p className="text-sm text-gray-500">This service card will be permanently removed. Are you sure?</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={() => handleDeleteService(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};