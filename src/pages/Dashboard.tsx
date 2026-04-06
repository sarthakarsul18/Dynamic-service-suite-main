import { useState, useEffect } from "react";
import React from 'react';
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Shield,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Heart,
  Stethoscope,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Phone,
  Plus,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ServiceManagement } from "@/components/dashboard/ServiceManagement";
import { CommunicationCenter } from "@/components/dashboard/CommunicationCenter";
import { ReportsSection } from "@/components/dashboard/ReportsSection";
import { CheckSquare, MapPin } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Agent {
  id: number;
  first_name: string;
  name: string;
  role?: string;
  email: string;
  mobile: string;
  phone:string;
  address: string;
  pincode: string;
  state: string;
  status: string;
  password?: string;
  confirmPassword?: string;
  type: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id?: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // honour ?tab= query param on load
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, []);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  // const [mobileUsers, setMobileUsers] = useState<Agent[]>([]);
const [mobileUsers, setMobileUsers] = useState<any[]>([]);
const [editingMobileUser, setEditingMobileUser] = React.useState(null);
const [permissionMobileUser, setPermissionMobileUser] = React.useState(null);
const [mobileUserModalOpen, setMobileUserModalOpen] = React.useState(false);
const [mobileUserPermissionModalOpen, setMobileUserPermissionModalOpen] = React.useState(false);
const [mobileUserLoading, setMobileUserLoading] = useState(false);
const [typeFilter, setTypeFilter] = useState("all");

  // Modal state
  const [open, setOpen] = useState(false);
  const [openmobile, setMobileOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [form, setForm] = useState<Partial<Agent>>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    pincode: "",
    state: "",
    status: "1",
  });
  const [mobileform, setmobilForm] = useState<Partial<Agent>>({
    first_name:"",
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    state: "",
    status: "1",
    type: "service"
  });
  const [isEdit, setIsEdit] = useState(false);
  const [ismobileEdit, setMobileIsEdit] = useState(false);
  const [step, setStep] = useState(1);
  const [mobilestep, setMobileStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]); // store permission names like 'Overview', 'Reports'
  // const [allowedPermissions, setAllowedPermissions] = useState<{id: number, name: string, category: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Agents search and pagination states
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [agentCurrentPage, setAgentCurrentPage] = useState(1);
  const [agentRowsPerPage, setAgentRowsPerPage] = useState(10);

//   const filteredUsers = mobileUsers.filter((user) => {
//   const search = searchTerm.toLowerCase();

//   return (
//     user.first_name?.toLowerCase().includes(search) ||
//     user.email?.toLowerCase().includes(search) ||
//     user.mobile?.includes(search) ||
//     user.state?.toLowerCase().includes(search) ||
//     user.pincode?.includes(search)
//   );
// });

const filteredUsers = mobileUsers.filter((user) => {
  const matchesSearch =
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm) ||
    user.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.pincode?.includes(searchTerm) ||
    user.type?.includes(searchTerm) 
    

  const matchesType =
    typeFilter === "all" || user.type === typeFilter;

  return matchesSearch && matchesType;
});

const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

const paginatedUsers = filteredUsers.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

// Agents filtering and pagination
const filteredAgents = agents.filter((agent) => {
  const search = agentSearchTerm.toLowerCase();
  return (
    agent.name?.toLowerCase().includes(search) ||
    agent.email?.toLowerCase().includes(search) ||
    agent.mobile?.includes(search) ||
    agent.state?.toLowerCase().includes(search) ||
    agent.pincode?.includes(search)
  );
});

const agentTotalPages = Math.ceil(filteredAgents.length / agentRowsPerPage);

const paginatedAgents = filteredAgents.slice(
  (agentCurrentPage - 1) * agentRowsPerPage,
  agentCurrentPage * agentRowsPerPage
);


  // Base stats available to all users
  const baseStats = [
    {
      title: "Active Policies",
      value: "1,834",
      change: "+8%",
      icon: Shield,
      color: "success" as const,
      onClick: () => navigate("/policy-details"),
    },
    {
      title: "Vehicle Enquiry",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "primary" as const,
      onClick: () => navigate("/vehicle-enquiry"),
    },
    {
      title: "Enquiry",
      value: "—",
      change: "+0%",
      icon: FileText,
      color: "accent" as const,
      onClick: () => navigate("/enquiry"),
    },
    {
      title: "Service Requests",
      value: "89",
      change: "+23%",
      icon: Heart,
      color: "accent" as const,
      onClick: () => navigate("/services-details"),
    },
  ];

  // Admin-only stat
  const adminStat = {
    title: "Company Master",
    value: "5",
    change: "+15%",
    icon: DollarSign,
    color: "warning" as const,
    onClick: () => navigate("/company-master"),
  };

  // Combine stats based on user role
  const stats = user && user.role === "admin" 
    ? [...baseStats, adminStat] 
    : baseStats;

  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const recentActivities = [
    {
      id: 1,
      message: "New pet insurance policy created for Fluffy",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      message: "Agent John Doe assigned to Mumbai region",
      time: "5 minutes ago",
      status: "info",
    },
    {
      id: 3,
      message: "Payment of ₹5,000 received for Policy #1234",
      time: "10 minutes ago",
      status: "success",
    },
    {
      id: 4,
      message: "Grooming service completed for Max",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 5,
      message: "Field team required for emergency in Pune",
      time: "20 minutes ago",
      status: "warning",
    },
  ];

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionModalType, setPermissionModalType] = useState<"agent" | "mobile">("agent");
  const [mobilePermTab, setMobilePermTab] = useState<"motor" | "health" | "other">("motor");

  // Pincode modal state
  const [pincodeModalAgent, setPincodeModalAgent] = useState<Agent | null>(null);
  const [allPincodeData, setAllPincodeData] = useState<any[]>([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pcState, setPcState] = useState("");
  const [pcDistrict, setPcDistrict] = useState("");
  const [pcCity, setPcCity] = useState("");
  const [pcSelectedPincodes, setPcSelectedPincodes] = useState<string[]>([]);
  const [pcTypes, setPcTypes] = useState<string[]>([]);
  const [pcSubmitting, setPcSubmitting] = useState(false);

  // Edit pincode modal state
  const [editPincodeAgent, setEditPincodeAgent] = useState<Agent | null>(null);
  const [agentPincodes, setAgentPincodes] = useState<any[]>([]);
  const [editPincodeLoading, setEditPincodeLoading] = useState(false);

  const pcStates = Array.from(new Set(allPincodeData.map(d => d.State).filter(Boolean))).sort();
  const pcDistricts = Array.from(new Set(allPincodeData.filter(d => d.State === pcState).map(d => d.District).filter(Boolean))).sort();
  const pcCities = Array.from(new Set(allPincodeData.filter(d => d.State === pcState && d.District === pcDistrict).map(d => d.City).filter(Boolean))).sort();
  const pcPincodes = Array.from(new Set(allPincodeData.filter(d => d.State === pcState && d.District === pcDistrict && d.City === pcCity && d.Pincode).map(d => String(d.Pincode)))).sort();

  const handleOpenPincodeModal = async (agent: Agent) => {
    setPincodeModalAgent(agent);
    setPcState(""); setPcDistrict(""); setPcCity(""); setPcSelectedPincodes([]); setPcTypes([]);
    if (allPincodeData.length === 0) {
      setPincodeLoading(true);
      try {
        const res = await axios.get("https://collectkart.docboyz.in/api/allpincodedata");
        setAllPincodeData(res.data.agent || []);
      } catch (e) { console.error(e); }
      finally { setPincodeLoading(false); }
    }
  };

  const togglePincode = (pin: string) => {
    setPcSelectedPincodes(prev => prev.includes(pin) ? prev.filter(p => p !== pin) : [...prev, pin]);
  };

  const togglePcType = (t: string) => {
    setPcTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handlePincodeSubmit = async () => {
    if (!pincodeModalAgent || pcSelectedPincodes.length === 0 || pcTypes.length === 0) {
      alert("Please select at least one pincode and one type."); return;
    }
    setPcSubmitting(true);
    try {
      await axios.post("https://collectkart.docboyz.in/api/agent-pincode-assign", {
        agent_id: pincodeModalAgent.id,
        pincodes: pcSelectedPincodes,
        types: pcTypes,
        state: pcState,
        district: pcDistrict,
        city: pcCity,
      });
      alert("✅ Pincodes assigned successfully!");
      setPincodeModalAgent(null);
    } catch (e) { console.error(e); alert("❌ Failed to assign pincodes."); }
    finally { setPcSubmitting(false); }
  };

  const handleClickToCall = async (destinationMobile: string) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const agentNumber = parsedUser?.mobile || parsedUser?.phone || "";
    if (!agentNumber) { alert("Your mobile number is not set in profile."); return; }
    try {
      await axios.post("https://insuranceapp.tommyandfurry.com/api/click-to-call", {
        async: 1,
        agent_number: agentNumber,
        destination_number: destinationMobile,
        caller_id: "7965801284",
      });
      alert(`✅ Call initiated to ${destinationMobile}`);
    } catch (e) {
      console.error(e);
      alert("❌ Failed to initiate call.");
    }
  };

  const handleOpenEditPincode = async (agent: Agent) => {
    setEditPincodeAgent(agent);
    setAgentPincodes([]);
    setEditPincodeLoading(true);
    try {
      const res = await axios.get(`https://collectkart.docboyz.in/api/agent-pincodes/${agent.id}`);
      setAgentPincodes(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setEditPincodeLoading(false); }
  };

  const handleDeletePincode = async (id: number) => {
    if (!confirm("Delete this pincode assignment?")) return;
    try {
      await axios.delete(`https://collectkart.docboyz.in/api/agent-pincodes/${id}`);
      setAgentPincodes(prev => prev.filter(p => p.id !== id));
    } catch (e) { console.error(e); alert("❌ Failed to delete."); }
  };
  const [agentMobileTab, setAgentMobileTab] = useState<"motor" | "health" | "other">("motor");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [motorPermissions, setMotorPermissions] = useState<number[]>([]);
  const [healthPermissions, setHealthPermissions] = useState<number[]>([]);
  const [otherPermissions, setOtherPermissions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add the isLoading state
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [newType, setNewType] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const API_BASE = "https://collectkart.docboyz.in/api"; // replace with your API

  // Fetch existing service types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/service-types`); // adjust endpoint
        setServiceTypes(response.data || []);
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };
    fetchTypes();
  }, []);

  // Add new service type
  const handleAddType = async () => {
    if (!newType) return;
    setIsAdding(true);
    try {
      const response = await axios.post(`${API_BASE}/service-types`, { type: newType });
      // Assuming API returns the added type
      setServiceTypes((prev) => [...prev, response.data.type || newType]);
      setNewType("");
    } catch (error) {
      console.error("Error adding service type:", error);
      alert("Failed to add type");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpload = async () => {
    if (!type || !file) {
      alert("⚠️ Please select type and file");
      return;
    }
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    try {
      setIsLoading(true); // Set loading state to true when the upload starts
      const res = await axios.post(
        "https://collectkart.docboyz.in/api/upload-data",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setIsLoading(false); // Set loading state to false when the upload completes
      alert("✅ Upload successful: " + res.data.message);
    } catch (err: any) {
      setIsLoading(false); // Set loading state to false in case of error
      console.error("Upload error:", err);
      alert(
        "❌ Upload failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const toggleUserStatus = async (user) => {
  const newStatus = user.status == 1 ? 0 : 1;

  // 🔹 1. Optimistic UI update
  setMobileUsers((prev) =>
    prev.map((u) =>
      u.id === user.id ? { ...u, status: newStatus } : u
    )
  );

  try {
    // 🔹 2. API call
    await fetch(`https://collectkart.docboyz.in/api/mobile-users-status/${user.id}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });
  } catch (error) {
    // 🔴 Rollback on failure
    setMobileUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: user.status } : u
      )
    );
    alert("Failed to update status");
  }
};


  // Sample permission list
 const permissionsList = [
  { id: 1, name: 'SMS', category: 'action'},
  { id: 2, name: 'Chat', category: 'action'},
  { id: 3, name: 'WhatsApp',category: 'action'},
  { id: 4, name: 'Overview', category: 'dashboard'},
  { id: 5, name: 'Services', category: 'dashboard'},
  { id: 6, name: 'Agents', category: 'dashboard'},
  { id: 7, name: 'Reports', category: 'dashboard'},
  { id: 8, name: 'Policy Godigit', category: 'mobile' },
  { id: 9, name: 'Policy FG', category: 'mobile' },
  { id: 10, name: 'Policy BJAJA', category: 'mobile' },
  { id: 11, name: 'TATA', category: 'mobile' },
  { id: 12, name: 'ICICI', category: 'mobile' },
  { id: 13, name: 'HDFC', category: 'mobile' },
];

 const togglePermission = (id: number) => {
  setSelectedPermissions((prev) =>
    prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
  );
};

const toggleMobilePermission = (tab: "motor" | "health" | "other", id: number) => {
  const setter = tab === "motor" ? setMotorPermissions : tab === "health" ? setHealthPermissions : setOtherPermissions;
  setter((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
};



//   const handlePermissionClick = async (agent) => {
//   setSelectedAgent(agent); // Set which user is selected
//   setPermissionModalOpen(true); // Open modal

//   try {
//     const res = await fetch(`https://collectkart.docboyz.in/api/custom-permissions/${agent.id}`);
//     const data = await res.json();
//     if (data.permissions) {
//   const selectedIds = data.permissions.map((serverPermission) => {
//     // Find the corresponding permission in your local list
//     const match = permissionsList.find(local =>
//       local.name === serverPermission.permission &&
//       local.category === serverPermission.category
//     );
//     return match?.id;
//   }).filter(Boolean); // Remove undefined values

//   setSelectedPermissions(selectedIds);
// }

//   } catch (error) {
//     console.error("Failed to fetch user permissions:", error);
//   }
// };

const [allowedPermissions, setAllowedPermissions] = useState<{id: number, name: string, category: string}[]>([]);

// When opening permission modal
const handlePermissionClick = async (agent: Agent) => {
  setSelectedAgent(agent);
  setPermissionModalType("agent");
  setAgentMobileTab("motor");
  setMotorPermissions([]);
  setHealthPermissions([]);
  setOtherPermissions([]);
  setPermissionModalOpen(true);

  try {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    let permissionsToShow: typeof permissionsList = [];

    if (parsedUser && parsedUser.id === 1) {
      // Super admin: show all permissions
      permissionsToShow = permissionsList;
    } else if (parsedUser) {
      // Fetch only allowed permissions from server
      const res = await fetch(`${API_BASE}/custom-permissions/${parsedUser.id}`);
      const data = await res.json();

      permissionsToShow = data.permissions.map((serverPermission) => {
        const match = permissionsList.find(
          (p) =>
            p.name === serverPermission.permission &&
            p.category === serverPermission.category
        );
        return match;
      }).filter(Boolean) as typeof permissionsList;
    }

    setAllowedPermissions(permissionsToShow);

    // Now get the agent's current permissions (if any)
    const agentRes = await fetch(`${API_BASE}/custom-permissions/${agent.id}`);
    const agentData = await agentRes.json();

    const nonMobileIds: number[] = [];
    const motorIds: number[] = [];
    const healthIds: number[] = [];
    const otherIds: number[] = [];

    agentData.permissions.forEach((serverPermission) => {
      const rawName: string = serverPermission.permission;
      const tabPrefixes = ["motor_", "health_", "other_"];
      let tab = "";
      let name = rawName;

      for (const prefix of tabPrefixes) {
        if (rawName.startsWith(prefix)) {
          tab = prefix.replace("_", "");
          name = rawName.slice(prefix.length);
          break;
        }
      }

      const match = permissionsToShow.find(
        (p) => p.name === name && p.category === serverPermission.category
      );
      if (match) {
        if (tab === "motor") motorIds.push(match.id);
        else if (tab === "health") healthIds.push(match.id);
        else if (tab === "other") otherIds.push(match.id);
        else nonMobileIds.push(match.id);
      }
    });

    setSelectedPermissions(nonMobileIds);
    setMotorPermissions(motorIds);
    setHealthPermissions(healthIds);
    setOtherPermissions(otherIds);

  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  }
};

const handlePermissionmobileClick = async (user: Agent) => {
  setSelectedAgent(user);
  setPermissionModalType("mobile");
  setMobilePermTab("motor");
  setPermissionModalOpen(true);
  setMotorPermissions([]);
  setHealthPermissions([]);
  setOtherPermissions([]);

  try {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    let permissionsToShow: typeof permissionsList = [];

    if (parsedUser && parsedUser.id === 1) {
      permissionsToShow = permissionsList;
    } else if (parsedUser) {
      const res = await fetch(`${API_BASE}/custom-permissions/${parsedUser.id}`);
      const data = await res.json();
      permissionsToShow = data.permissions.map((serverPermission) => {
        const match = permissionsList.find(
          (p) => p.name === serverPermission.permission && p.category === serverPermission.category
        );
        return match;
      }).filter(Boolean) as typeof permissionsList;
    }

    setAllowedPermissions(permissionsToShow);

    // Load existing permissions — support prefixed format: "motor_Name", "health_Name", "other_Name"
    const agentRes = await fetch(`${API_BASE}/mobile-permissions/${user.id}`);
    const agentData = await agentRes.json();

    const motorIds: number[] = [];
    const healthIds: number[] = [];
    const otherIds: number[] = [];

    agentData.permissions.forEach((serverPermission) => {
      const rawName: string = serverPermission.permission;
      const tabPrefixes = ["motor_", "health_", "other_"];
      let tab = "motor";
      let name = rawName;

      for (const prefix of tabPrefixes) {
        if (rawName.startsWith(prefix)) {
          tab = prefix.replace("_", "");
          name = rawName.slice(prefix.length);
          break;
        }
      }

      const match = permissionsToShow.find(
        (p) => p.name === name && p.category === serverPermission.category
      );
      if (match) {
        if (tab === "motor") motorIds.push(match.id);
        else if (tab === "health") healthIds.push(match.id);
        else otherIds.push(match.id);
      }
    });

    setMotorPermissions(motorIds);
    setHealthPermissions(healthIds);
    setOtherPermissions(otherIds);

  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  }
};





  const handleAssignPermissions = async () => {
  if (!selectedAgent) {
    console.error("❌ No agent selected");
    return;
  }

  const groupedPermissions: { action: string[]; dashboard: string[]; mobile: string[] } = {
    action: [],
    dashboard: [],
    mobile: [],
  };

  // Group action + dashboard by category using names (non-mobile)
  selectedPermissions.forEach((id) => {
    const perm = permissionsList.find((p) => p.id === id);
    if (perm && perm.category !== "mobile" && groupedPermissions[perm.category]) {
      groupedPermissions[perm.category].push(perm.name);
    }
  });

  // Add mobile permissions with tab prefix
  motorPermissions.forEach((id) => {
    const p = permissionsList.find((p) => p.id === id);
    if (p) groupedPermissions.mobile.push(`motor_${p.name}`);
  });
  healthPermissions.forEach((id) => {
    const p = permissionsList.find((p) => p.id === id);
    if (p) groupedPermissions.mobile.push(`health_${p.name}`);
  });
  otherPermissions.forEach((id) => {
    const p = permissionsList.find((p) => p.id === id);
    if (p) groupedPermissions.mobile.push(`other_${p.name}`);
  });

  try {
    const res = await fetch("https://collectkart.docboyz.in/api/permission_assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedAgent.id,
        permissions: groupedPermissions,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("✅ Permissions assigned successfully!");
    setPermissionModalOpen(false);
  } catch (error) {
    console.error("❌ API Error:", error);
  }
};

const handleMobileAssignPermissions = async () => {
  if (!selectedAgent) {
    console.error("❌ No agent selected");
    return;
  }

  // Build mobile permission names with tab prefix so each tab is stored independently
  const mobileNames: string[] = [
    ...motorPermissions.map((id) => {
      const p = permissionsList.find((p) => p.id === id);
      return p ? `motor_${p.name}` : null;
    }).filter(Boolean) as string[],
    ...healthPermissions.map((id) => {
      const p = permissionsList.find((p) => p.id === id);
      return p ? `health_${p.name}` : null;
    }).filter(Boolean) as string[],
    ...otherPermissions.map((id) => {
      const p = permissionsList.find((p) => p.id === id);
      return p ? `other_${p.name}` : null;
    }).filter(Boolean) as string[],
  ];

  const groupedPermissions = { action: [], dashboard: [], mobile: mobileNames };

  try {
    const res = await fetch("https://collectkart.docboyz.in/api/mobileuser_permission_assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedAgent.id,
        permissions: groupedPermissions,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("✅ Permissions assigned successfully!");
    setPermissionModalOpen(false);
  } catch (error) {
    console.error("❌ API Error:", error);
  }
};



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // ✅ Fetch permissions for the logged-in user
    fetch(`https://collectkart.docboyz.in/api/custom-permissions/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (parsedUser.id === 1) {
          // Super admin, allow all dashboard tabs
          setUserPermissions(['Overview', 'Services', 'Agents', 'Reports', 'Settings', 'Communication']);
        } else {
          const dashboardPermissions = data.permissions
            .filter(p => p.category === 'dashboard')
            .map(p => p.permission);
          setUserPermissions(dashboardPermissions);
        }
      })
      .catch(err => {
        console.error("❌ Failed to load user permissions:", err);
      });

  } else {
    navigate("/login");
  }
}, []);


  // Fetch agents from Laravel API
  const fetchAgents = () => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    const payload = {
              
              user_id: parsedUser.id
            };
    axios
      .post("https://collectkart.docboyz.in/api/agentlist",payload)
      .then((res) => setAgents(res.data.data))
      .catch((err) => console.error("Failed to fetch agents:", err))
      .finally(() => setLoading(false));
  };

  const fetchMobileUsers = () => {
  setMobileUserLoading(true);

  const storedUser = localStorage.getItem("user");
  const parsedUser = JSON.parse(storedUser!);

  axios
    .post("https://collectkart.docboyz.in/api/mobile-user-list", {
      user_id: parsedUser.id,
    })
    .then((res) => setMobileUsers(res.data.data))
    .catch((err) => console.error("Failed to fetch mobile users:", err))
    .finally(() => setMobileUserLoading(false));
};


  useEffect(() => {
    if (activeTab === "agents") fetchAgents();
  }, [activeTab]);

  useEffect(() => {
  if (activeTab === "-status") {
    fetchMobileUsers();
  }
}, [activeTab]);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  } else {
    // Optional: redirect if no user is logged in
    navigate("/login");
  }
}, []);

// EDIT
const handleEditMobileUser = (user: any) => {
  setEditingMobileUser(user);
  setMobileUserModalOpen(true);
};

// DELETE
const handleDeleteMobileUser = (userId: number) => {
  if (!confirm("Are you sure you want to delete this mobile user?")) return;

  axios
    .post("https://collectkart.docboyz.in/api/delete-mobile-user", { user_id: userId })
    .then(() => {
      alert("✅ Mobile user deleted");
      fetchMobileUsers();
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to delete mobile user");
    });
};

// PERMISSION
const handlePermissionMobileUser = (user: any) => {
  setPermissionMobileUser(user);
  setMobileUserPermissionModalOpen(true);
};

const handleCloseMobileUserPermissionModal = () => {
  setMobileUserPermissionModalOpen(false);
  setPermissionMobileUser(null);
};


const handleStatusChange = (agentId, status) => {
  axios
    .post("https://collectkart.docboyz.in/api/update-agent-status", {
      agent_id: agentId,
      status: status, // 1 = active, 0 = inactive
    })
    .then(() => {
      fetchAgents(); // refresh list after update
    })
    .catch((err) => {
      console.error("Status update failed:", err);
    });
};


  // Handle add or update agent
  const handleSubmit = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (isEdit && form.id) {
      axios
        .put(`https://collectkart.docboyz.in/api/updateagentlist/${form.id}`, form)
        .then(() => {
          fetchAgents();
          setOpen(false);
          setForm({});
          setIsEdit(false);
          setStep(1);
        })
        .catch((err) => console.error("Update failed:", err));
    } else {

        // ✅ Pass user_id ONLY for storagent
            const payload = {
              ...form,
              user_id: parsedUser.id,
              company_id: parsedUser.company_id
            };

            axios
              .post("https://collectkart.docboyz.in/api/storagent", payload)
              .then(() => {
                fetchAgents();
                setOpen(false);
                setForm({});
                setStep(1);
              })
              .catch((err) => console.error("Add agent failed:", err));
          }
    
  };

  const handleMobileUserSubmit = () => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    const parsedUser = JSON.parse(storedUser);
    if (ismobileEdit && mobileform.id) {
      axios
        .put(`https://collectkart.docboyz.in/api/updatemobileuserlist/${mobileform.id}`, mobileform)
        .then(() => {
          fetchAgents();
          setMobileOpen(false);
          setmobilForm({});
          setMobileIsEdit(false);
          setMobileStep(1);
        })
        .catch((err) => console.error("Update failed:", err));
    } else {
      console.log(parsedUser);
        // ✅ Pass user_id ONLY for storagent
            const payload = {
              ...mobileform,
              user_id: parsedUser.id,
              company_id: parsedUser.company_id
            };

            axios
              .post("https://collectkart.docboyz.in/api/stormobileuser", payload)
              .then(() => {
                fetchAgents();
                setOpen(false);
                setForm({});
                setStep(1);
              })
              .catch((err) => console.error("Add agent failed:", err));
          }
    
  };

  // Open edit modal
  const handleEdit = (agent: Agent) => {
    setForm(agent);
    setIsEdit(true);
    setStep(1);
    setOpen(true);
  };
   const handlemobileuserEdit = (user: Agent) => {
    setmobilForm(user);
    setMobileIsEdit(true);
    setMobileStep(1);
    setMobileOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      {/* {user && (
      <div className="mb-6">
        <h2 className="text-xl font-bold">Welcome, {user.name}</h2> */}
        {/* <p className="text-muted-foreground">{user.email}</p> */}
      {/* </div>
      )} */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tommyandfurry Services Dashboard</h1>
          <p className="text-muted-foreground">
            {/* Manage your multi-tenant pet services platform */}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 w-full">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Users className="w-4 h-4" /> Agents
            </TabsTrigger>
            <TabsTrigger value="services">
              <Heart className="w-4 h-4" /> Services
            </TabsTrigger>
            <TabsTrigger value="communication">
              <MessageSquare className="w-4 h-4" /> Communication
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4" /> Reports
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList> */}
          <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-7 w-full">
          {userPermissions.includes("Overview") && (
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4" /> Overview
            </TabsTrigger>
          )}

          {/* {userPermissions.includes("Agents") && (
            <TabsTrigger value="agents">
              <Users className="w-4 h-4" /> Agents
            </TabsTrigger>
          )} */}

          {userPermissions.includes("Agents") && (
            <TabsTrigger value="agents">
              <Users className="w-4 h-4" />Comapny Users
            </TabsTrigger>
          )}

          {/* {userPermissions.includes("Agents") && (
            <TabsTrigger value="-status">
              <Users className="w-4 h-4" /> Mobile User
            </TabsTrigger>
          )} */}

            {userPermissions.includes("Agents") && (
            <TabsTrigger value="-status">
              <Users className="w-4 h-4" /> POSP
            </TabsTrigger>
          )}

          {userPermissions.includes("Services") && (
            <TabsTrigger value="services">
              <Heart className="w-4 h-4" /> Leads
            </TabsTrigger>
          )}

          {userPermissions.includes("Communication") && (
            <TabsTrigger value="communication">
              <MessageSquare className="w-4 h-4" /> Communication
            </TabsTrigger>
          )}

          {userPermissions.includes("Reports") && (
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4" /> Reports
            </TabsTrigger>
          )}

          {userPermissions.includes("Reports") && (
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" /> Lead Upload
            </TabsTrigger>
          )}
          {userPermissions.length === 0 && (
            <p className="text-red-500 mt-4">You don’t have permission to view any dashboard sections.</p>
          )}
        </TabsList>


          {/* Overview */}
          {userPermissions.includes("Overview") && (
            <TabsContent value="overview" className="space-y-6">
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest updates across all tenants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-gradient-card"
                    >
                      {getStatusIcon(activity.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <UserCheck className="w-4 h-4 mr-2" /> Add New Agent
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Shield className="w-4 h-4 mr-2" /> Create Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Stethoscope className="w-4 h-4 mr-2" /> Schedule Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" /> Send Broadcast
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="w-4 h-4 mr-2" /> Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}
          

          {/* Agents */}
          <TabsContent value="agents">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Active Company Users</CardTitle>
                  <CardDescription>Manage agents across locations and services</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setOpen(true);
                    setIsEdit(false);
                    setStep(1);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Agent
                </Button>
              </CardHeader>
              <CardContent>
                {/* Search field for agents */}
                <div className="flex items-center mb-4 gap-3">
                  <input
                    type="text"
                    placeholder="Search by name, email, mobile, state, pincode"
                    value={agentSearchTerm}
                    onChange={(e) => {
                      setAgentSearchTerm(e.target.value);
                      setAgentCurrentPage(1);
                    }}
                    className="border rounded-md px-3 py-2 w-80 text-sm"
                  />
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select
                      value={agentRowsPerPage}
                      onChange={(e) => {
                        setAgentRowsPerPage(Number(e.target.value));
                        setAgentCurrentPage(1);
                      }}
                      className="border rounded-md px-2 py-2 text-sm"
                    >
                      {[5, 10, 20, 30, 50, 100].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <p>Loading agents...</p>
                ) : (
                  <>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Agent</th>
                          <th className="py-2 px-3">Contact</th>
                          <th className="py-2 px-3">Location</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Today's Calls</th>
                          <th className="py-2 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAgents.map((agent, index) => (
                        <tr key={agent.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-500">{(agentCurrentPage - 1) * agentRowsPerPage + index + 1}</td>
                          <td className="py-2 px-3">{agent.name}</td>
                          <td className="py-2 px-3">
                            <p>{agent.email}</p>
                            {/* <p className="text-xs text-gray-500">{agent.mobile}</p> */}
                          </td>
                          <td className="py-2 px-3">{agent.state}, PIN {agent.pincode}</td>
                          <td className="py-2 px-3">
                          {agent.status === "1" ? (
                            <span
                              onClick={() => handleStatusChange(agent.id, 0)}
                              className="cursor-pointer px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                              title="Click to Inactive"
                            >
                              Active
                            </span>
                          ) : (
                            <span
                              onClick={() => handleStatusChange(agent.id, 1)}
                              className="cursor-pointer px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                              title="Click to Active"
                            >
                              Inactive
                            </span>
                          )}
                        </td>
                          <td className="py-2 px-3 text-center">{Math.floor(Math.random() * 15)}</td>
                          <td className="py-2 px-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(agent)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleClickToCall(agent.mobile)}>
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                           <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePermissionClick(agent)}
                            >
                            <Shield className="w-4 h-4" />
                            Permission
                          </Button>
                          <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              onClick={() => handleOpenPincodeModal(agent)}
                            >
                            <MapPin className="w-4 h-4 mr-1" />
                            {/* Add Pincode */}
                          </Button>
                          <Button
                              size="sm"
                              variant="outline"
                              className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                              onClick={() => handleOpenEditPincode(agent)}
                            >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Pincode
                          </Button>


                  {/* Permission Modal - Agent */}
                  {permissionModalOpen && permissionModalType === "agent" && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-white">Assign Permissions</h2>
                              <p className="text-blue-100 text-xs">{selectedAgent?.name}</p>
                            </div>
                          </div>
                          <button onClick={() => setPermissionModalOpen(false)} className="text-white/70 hover:text-white text-xl font-bold leading-none">✕</button>
                        </div>

                        {/* Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                          {/* Action column */}
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                              Action Permissions
                            </h3>
                            <div className="space-y-2">
                              {allowedPermissions.filter((p) => p.category === "action").map((permission) => (
                                <label key={permission.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{permission.name}</span>
                                  <div className="relative">
                                    <input type="checkbox" className="sr-only peer" checked={selectedPermissions.includes(permission.id)} onChange={() => togglePermission(permission.id)} />
                                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></div>
                                  </div>
                                </label>
                              ))}
                              {allowedPermissions.filter((p) => p.category === "action").length === 0 && <p className="text-xs text-gray-400 text-center py-2">No permissions</p>}
                            </div>
                          </div>

                          {/* Dashboard column */}
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              Dashboard Permissions
                            </h3>
                            <div className="space-y-2">
                              {allowedPermissions.filter((p) => p.category === "dashboard").map((permission) => (
                                <label key={permission.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{permission.name}</span>
                                  <div className="relative">
                                    <input type="checkbox" className="sr-only peer" checked={selectedPermissions.includes(permission.id)} onChange={() => togglePermission(permission.id)} />
                                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></div>
                                  </div>
                                </label>
                              ))}
                              {allowedPermissions.filter((p) => p.category === "dashboard").length === 0 && <p className="text-xs text-gray-400 text-center py-2">No permissions</p>}
                            </div>
                          </div>

                          {/* Mobile column with Motor/Health/Other tabs */}
                          <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            <div className="px-4 pt-4 pb-2">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Mobile Permissions
                              </h3>
                            </div>
                            {/* Sub-tabs */}
                            <div className="flex border-b border-gray-200 bg-white">
                              {(["motor", "health", "other"] as const).map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() => setAgentMobileTab(tab)}
                                  className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors ${
                                    agentMobileTab === tab
                                      ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                >
                                  {tab === "motor" ? "🚗 Motor" : tab === "health" ? "🏥 Health" : "📋 Other"}
                                </button>
                              ))}
                            </div>
                            <div className="p-3 space-y-1 max-h-52 overflow-y-auto">
                              {allowedPermissions.filter((p) => p.category === "mobile").map((permission) => {
                                const tabState = agentMobileTab === "motor" ? motorPermissions : agentMobileTab === "health" ? healthPermissions : otherPermissions;
                                const isChecked = tabState.includes(permission.id);
                                return (
                                  <label key={`agent-${agentMobileTab}-${permission.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{permission.name}</span>
                                    <div className="relative">
                                      <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={() => toggleMobilePermission(agentMobileTab, permission.id)} />
                                      <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-colors duration-200"></div>
                                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></div>
                                    </div>
                                  </label>
                                );
                              })}
                              {allowedPermissions.filter((p) => p.category === "mobile").length === 0 && <p className="text-xs text-gray-400 text-center py-2">No permissions</p>}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                          <button onClick={() => setPermissionModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            Cancel
                          </button>
                          <button onClick={handleAssignPermissions} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                            Save Permissions
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination for agents */}
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {(agentCurrentPage - 1) * agentRowsPerPage + 1} to{" "}
                      {Math.min(agentCurrentPage * agentRowsPerPage, filteredAgents.length)} of{" "}
                      {filteredAgents.length} agents
                    </p>

                    <div className="flex gap-2">
                      <button
                        disabled={agentCurrentPage === 1}
                        onClick={() => setAgentCurrentPage(agentCurrentPage - 1)}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      >
                        Prev
                      </button>

                      {[...Array(agentTotalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setAgentCurrentPage(index + 1)}
                          className={`px-3 py-1 text-sm border rounded ${
                            agentCurrentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-white"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        disabled={agentCurrentPage === agentTotalPages}
                        onClick={() => setAgentCurrentPage(agentCurrentPage + 1)}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="-status">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>POSP List</CardTitle>
                <CardDescription>
                  List of registered mobile app users
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setMobileOpen(true);
                  setMobileIsEdit(false);
                  setMobileStep(1);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add POSP
              </Button>
            </CardHeader>

            <CardContent>
  {mobileUserLoading ? (
    <p>Loading mobile users...</p>
  ) : (
    <>
      {/* 🔍 STEP 4: SEARCH */}
     <div className="flex items-center mb-4 gap-3">
  {/* Search */}
  <input
    type="text"
    placeholder="Search by name, email, mobile, state, pincode"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    className="border rounded-md px-3 py-2 w-80 text-sm"
  />

  {/* Type Filter */}
  <select
    value={typeFilter}
    onChange={(e) => {
      setTypeFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="border rounded-md px-3 py-2 text-sm"
  >
    <option value="all">All Types</option>
    <option value="service">Service</option>
    <option value="Policy">Policy</option>
    <option value="Policy Agent">Policy Agent</option>
  </select>

  {/* Rows per page */}
  <div className="flex items-center gap-2 ml-auto">
    <span className="text-sm text-gray-600">Rows per page:</span>
    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border rounded-md px-2 py-2 text-sm"
    >
      {[5, 10, 20, 30, 50, 100].map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>
</div>



      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">User</th>
            <th className="py-2 px-3">Contact</th>
            <th className="py-2 px-3">Location</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* ✅ STEP 5: PAGINATED USERS */}
          {paginatedUsers.map((user, index) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-500">{(currentPage - 1) * rowsPerPage + index + 1}</td>
              <td className="py-2 px-3">{user.first_name}</td>

              <td className="py-2 px-3">
                <p>{user.email}</p>
                <p className="text-xs text-gray-500">{user.mobile}</p>
              </td>

              <td className="py-2 px-3">
                {user.state}, PIN {user.pincode}
              </td>

              <td className="py-2 px-3">
              <button
                onClick={() => toggleUserStatus(user)}
                className={`px-2 py-1 text-xs rounded-full font-medium transition
                  ${
                    user.status == 1
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                {user.status == 1 ? "Active" : "Inactive"}
              </button>
            </td>


               <td className="py-2 px-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handlemobileuserEdit(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              const mobile = user.mobile || user.phone || "";
                              if (!mobile) { alert("No mobile number available for this user."); return; }
                              handleClickToCall(mobile);
                            }}>
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                           <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePermissionmobileClick(user)} // Pass clicked agent
                            >
                            <Shield className="w-4 h-4" />
                            Permission
                          </Button>


                  {/* Permission Modal - Mobile Users */}
                  {permissionModalOpen && permissionModalType === "mobile" && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-white">Mobile Permissions</h2>
                              <p className="text-purple-100 text-xs">{selectedAgent?.first_name || selectedAgent?.name}</p>
                            </div>
                          </div>
                          <button onClick={() => setPermissionModalOpen(false)} className="text-white/70 hover:text-white text-xl font-bold leading-none">✕</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b bg-gray-50">
                          {(["motor", "health", "other"] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setMobilePermTab(tab)}
                              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                                mobilePermTab === tab
                                  ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {tab === "motor" ? "🚗 Motor" : tab === "health" ? "🏥 Health" : "📋 Other"}
                            </button>
                          ))}
                        </div>

                        {/* Permission list */}
                        <div className="p-5 space-y-2 max-h-72 overflow-y-auto">
                          {allowedPermissions.filter((p) => p.category === "mobile").map((permission) => {
                            const tabState = mobilePermTab === "motor" ? motorPermissions : mobilePermTab === "health" ? healthPermissions : otherPermissions;
                            const isChecked = tabState.includes(permission.id);
                            return (
                              <label key={`${mobilePermTab}-${permission.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors group border border-transparent hover:border-purple-100">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{permission.name}</span>
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isChecked}
                                    onChange={() => toggleMobilePermission(mobilePermTab, permission.id)}
                                  />
                                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-colors duration-200"></div>
                                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></div>
                                </div>
                              </label>
                            );
                          })}
                          {allowedPermissions.filter((p) => p.category === "mobile").length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-6">No mobile permissions available</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                          <button onClick={() => setPermissionModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            Cancel
                          </button>
                          <button onClick={handleMobileAssignPermissions} className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-sm">
                            Save Permissions
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                          </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ STEP 6: PAGINATION (OUTSIDE TABLE) */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )}
</CardContent>

          </Card>
        </TabsContent>


          {/* Other Tabs */}
          <TabsContent value="services"><ServiceManagement /></TabsContent>
          <TabsContent value="communication"><CommunicationCenter /></TabsContent>
          <TabsContent value="reports"><ReportsSection /></TabsContent>
          <TabsContent value="settings">
            <div className="flex gap-6">
              {/* Upload Data Card */}
              <Card className="w-1/2 bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Upload Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    {/* Type Selection */}
                    <div className="flex-1">
                      <Label htmlFor="type" className="mb-2 font-medium text-gray-700">
                        Type
                      </Label>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                      >
                        <option value="">Select Database</option>
                        <option value="regtech">RegTech</option>
                        <option value="tommyandfurry">Tommy & Furry</option>
                        <option value="docboyz">DocBoyz</option>
                      </select>
                    </div>

                    {/* File Upload */}
                    <div className="flex-1">
                      <Label htmlFor="file" className="mb-2 font-medium text-gray-700">
                        File
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border border-gray-300 rounded-lg p-3 cursor-pointer file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold file:px-3 file:py-2 hover:file:bg-indigo-200 transition duration-300"
                      />
                    </div>

                    {/* Upload Button */}
                    <div className="flex-shrink-0">
                      <Button
                        onClick={handleUpload}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>

                  {/* Loader / Spinner */}
                  {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                      <svg
                        className="animate-spin h-8 w-8 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm2 0h12"
                          className="opacity-75"
                        />
                      </svg>
                      <p className="ml-3 text-gray-600">Uploading...</p>
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "https://docboyz.in/Dummy_Pet_Services_Clients_26.xlsx"; // path in public folder
                        link.download = "Dummy_Pet_Services_Clients_26.xlsx";
                        link.click();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
                    >
                      Download Demo File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Service Type Card */}
              <Card className="w-1/2 bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Service Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display existing service types */}
        <div className="mb-4 flex flex-wrap gap-2">
          {serviceTypes.length ? (
            serviceTypes.map((type, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))
          ) : (
            <p className="text-gray-600">No service types found.</p>
          )}
        </div>

        {/* Add new type */}
        <div className="flex gap-2">
          <Input
            placeholder="New service type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <Button
            onClick={handleAddType}
            disabled={isAdding}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            {isAdding ? "Adding..." : "Add Type"}
          </Button>
        </div>
      </CardContent>
    </Card>
            </div>
          </TabsContent>


        </Tabs>
      </main>

      {/* Add/Edit Agent Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-bold m-0">{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
              <p className="text-blue-100 text-xs">{step === 1 ? "Step 1 of 2 — Personal Details" : "Step 2 of 2 — Set Password"}</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</Label>
                    <Input className="mt-1" placeholder="Full name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</Label>
                    <Input className="mt-1" placeholder="email@example.com" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mobile</Label>
                    <Input className="mt-1" placeholder="10-digit number" value={form.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pincode</Label>
                    <Input className="mt-1" placeholder="6-digit pincode" value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</Label>
                  <Input className="mt-1" placeholder="Street address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">State</Label>
                  <Input className="mt-1" placeholder="State" value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</Label>
                  <Input className="mt-1" type="password" placeholder="Min 8 chars, e.g. Test@123"
                    value={form.password || ""}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <p className="text-xs text-gray-400 mt-1">Must be 8+ characters with uppercase, lowercase, number &amp; special character</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm Password</Label>
                  <Input className="mt-1" type="password" placeholder="Re-enter password"
                    value={form.confirmPassword || ""}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {form.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(form.password) && (
                    <p className="text-xs text-red-500 mt-1">Password must be 8+ characters with uppercase, lowercase, number &amp; special character (e.g. Test@123)</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            {step === 2 && !isEdit && (
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
            )}
            <div className="ml-auto flex gap-3">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              {step === 1 && !isEdit && (
                <button onClick={() => setStep(2)} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  Next →
                </button>
              )}
              {(step === 2 || isEdit) && (
                <button
                  onClick={() => {
                    if (!isEdit) {
                      const pwd = form.password || "";
                      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd)) {
                        alert("Password must be 8+ characters with uppercase, lowercase, number & special character (e.g. Test@123)");
                        return;
                      }
                      if (form.password !== form.confirmPassword) {
                        alert("Passwords do not match");
                        return;
                      }
                    }
                    handleSubmit();
                  }}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  {isEdit ? "Update Agent" : "Add Agent"}
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openmobile} onOpenChange={setMobileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ismobileEdit ? "Edit Mobile User" : "Add Mobile User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {mobilestep === 1 && (
              <>
                <div><Label>Name</Label><Input value={mobileform.first_name || ""} onChange={(e) => setmobilForm({ ...mobileform, first_name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={mobileform.email || ""} onChange={(e) => setmobilForm({ ...mobileform, email: e.target.value })} /></div>
                <div><Label>Mobile</Label><Input value={mobileform.phone || ""} onChange={(e) => setmobilForm({ ...mobileform, phone: e.target.value })} /></div>
                <div><Label>Address</Label><Input value={mobileform.address || ""} onChange={(e) => setmobilForm({ ...mobileform, address: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input value={mobileform.pincode || ""} onChange={(e) => setmobilForm({ ...mobileform, pincode: e.target.value })} /></div>
                <div><Label>State</Label><Input value={mobileform.state || ""} onChange={(e) => setmobilForm({ ...mobileform, state: e.target.value })} /></div>
                <div>
                    <Label>Type</Label>
                    <select
                      value={mobileform.type || "service"}
                      onChange={(e) =>
                        setmobilForm({ ...mobileform, type: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="service">Service</option>
                      <option value="Policy">Policy</option>
                      <option value="Policy Agent">Policy Agent</option>
                    </select>
                  </div>
              </>
            )}
            {mobilestep === 2 && (
              <>
                <div><Label>Password</Label><Input type="password" value={mobileform.password || ""} onChange={(e) => setmobilForm({ ...mobileform, password: e.target.value })} /></div>
                <div><Label>Confirm Password</Label><Input type="password" value={mobileform.confirmPassword || ""} onChange={(e) => setmobilForm({ ...mobileform, confirmPassword: e.target.value })} /></div>
              </>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            {mobilestep === 1 && !ismobileEdit && <Button onClick={() => setMobileStep(2)}>Next</Button>}
            {(mobilestep === 2 || ismobileEdit) && <Button onClick={handleMobileUserSubmit}>{ismobileEdit ? "Update Agent" : "Add Agent"}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Pincode Modal */}
      {pincodeModalAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Add Service Pincode</h2>
                  <p className="text-blue-100 text-xs">{pincodeModalAgent.name}</p>
                </div>
              </div>
              <button onClick={() => setPincodeModalAgent(null)} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {pincodeLoading ? (
                <p className="text-center text-gray-400 py-6">Loading pincode data...</p>
              ) : (
                <>
                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">State</label>
                    <select value={pcState} onChange={(e) => { setPcState(e.target.value); setPcDistrict(""); setPcCity(""); setPcSelectedPincodes([]); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select state...</option>
                      {pcStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">District</label>
                    <select value={pcDistrict} onChange={(e) => { setPcDistrict(e.target.value); setPcCity(""); setPcSelectedPincodes([]); }}
                      disabled={!pcState}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                      <option value="">Select district...</option>
                      {pcDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">City</label>
                    <select value={pcCity} onChange={(e) => { setPcCity(e.target.value); setPcSelectedPincodes([]); }}
                      disabled={!pcDistrict}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                      <option value="">Select city...</option>
                      {pcCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Pincodes multiselect */}
                  {pcCity && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Pincodes <span className="text-blue-500 font-normal normal-case">(select multiple)</span>
                      </label>
                      <div className="border border-gray-300 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1">
                        {pcPincodes.length > 0 ? pcPincodes.map(pin => (
                          <label key={pin} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded">
                            <input type="checkbox" checked={pcSelectedPincodes.includes(pin)} onChange={() => togglePincode(pin)} className="accent-blue-600" />
                            <span className="text-sm">{pin}</span>
                          </label>
                        )) : <p className="text-xs text-gray-400">No pincodes found for this city</p>}
                      </div>
                      {pcSelectedPincodes.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">{pcSelectedPincodes.length} pincode(s) selected</p>
                      )}
                    </div>
                  )}

                  {/* Type multiselect */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Type <span className="text-blue-500 font-normal normal-case">(select multiple)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Service Call", "POSP"].map(t => (
                        <button key={t} type="button" onClick={() => togglePcType(t)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${pcTypes.includes(t) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setPincodeModalAgent(null)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={handlePincodeSubmit} disabled={pcSubmitting || pcSelectedPincodes.length === 0 || pcTypes.length === 0}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {pcSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Pincode Modal */}
      {editPincodeAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Assigned Pincodes</h2>
                  <p className="text-indigo-100 text-xs">{editPincodeAgent.name}</p>
                </div>
              </div>
              <button onClick={() => setEditPincodeAgent(null)} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {editPincodeLoading ? (
                <p className="text-center text-gray-400 py-8">Loading...</p>
              ) : agentPincodes.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No pincodes assigned yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left bg-gray-50">
                      <th className="py-2 px-3 font-semibold text-gray-600">#</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">Pincode</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">Type</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">State</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">District</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">City</th>
                      <th className="py-2 px-3 font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPincodes.map((p, idx) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium">{p.pincode}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{p.type}</span>
                        </td>
                        <td className="py-2 px-3">{p.state || "—"}</td>
                        <td className="py-2 px-3">{p.district || "—"}</td>
                        <td className="py-2 px-3">{p.city || "—"}</td>
                        <td className="py-2 px-3">
                          <button onClick={() => handleDeletePincode(p.id)}
                            className="w-7 h-7 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">{agentPincodes.length} record(s)</span>
              <button onClick={() => setEditPincodeAgent(null)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <AppFooter />
    </div>
  );
};

export default Dashboard;
