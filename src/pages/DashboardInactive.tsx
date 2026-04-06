import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
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
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ServiceManagement } from "@/components/dashboard/ServiceManagement";
import { CommunicationCenter } from "@/components/dashboard/CommunicationCenter";
import { ReportsSection } from "@/components/dashboard/ReportsSection";
import { CheckSquare } from 'lucide-react';

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
  name: string;
  role?: string;
  email: string;
  mobile: string;
  address: string;
  pincode: string;
  state: string;
  status: string;
  password?: string;
  confirmPassword?: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [open, setOpen] = useState(false);
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
  const [isEdit, setIsEdit] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]); // store permission names like 'Overview', 'Reports'


  const stats = [
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
      title: "Service Requests",
      value: "89",
      change: "+23%",
      icon: Heart,
      color: "accent" as const,
      onClick: () => navigate("/services-details"),
    },
    {
      title: "Company Master",
      value: "2",
      change: "+15%",
      icon: DollarSign,
      color: "warning" as const,
      onClick: () => navigate("/company-master"),
    },
    
  ];

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
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
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
];

 const togglePermission = (id: number) => {
  setSelectedPermissions((prev) =>
    prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
  );
};



  const handlePermissionClick = async (agent) => {
  setSelectedAgent(agent); // Set which user is selected
  setPermissionModalOpen(true); // Open modal

  try {
    const res = await fetch(`https://collectkart.docboyz.in/api/custom-permissions/${agent.id}`);
    const data = await res.json();
    if (data.permissions) {
  const selectedIds = data.permissions.map((serverPermission) => {
    // Find the corresponding permission in your local list
    const match = permissionsList.find(local =>
      local.name === serverPermission.permission &&
      local.category === serverPermission.category
    );
    return match?.id;
  }).filter(Boolean); // Remove undefined values

  setSelectedPermissions(selectedIds);
}

  } catch (error) {
    console.error("Failed to fetch user permissions:", error);
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

  // Group by category using names
  selectedPermissions.forEach((id) => {
    const perm = permissionsList.find((p) => p.id === id);
    if (perm && groupedPermissions[perm.category]) {
      groupedPermissions[perm.category].push(perm.name);
    }
  });

  try {
    const res = await fetch("https://collectkart.docboyz.in/api/permission_assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedAgent.id, // Send user_id
        permissions: groupedPermissions, // Send permission names grouped by category
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

  useEffect(() => {
    if (activeTab === "agents") fetchAgents();
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

  // Open edit modal
  const handleEdit = (agent: Agent) => {
    setForm(agent);
    setIsEdit(true);
    setStep(1);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      {/* {user && (
      <div className="mb-6">
        <h2 className="text-xl font-bold">Welcome, {user.name}</h2> */}
        {/* <p className="text-muted-foreground">{user.email}</p> */}
      {/* </div>
      )} */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pet Services Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your multi-tenant pet services platform
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
          <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 w-full">
          {userPermissions.includes("Overview") && (
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4" /> Overview
            </TabsTrigger>
          )}

          {userPermissions.includes("Agents") && (
            <TabsTrigger value="agents">
              <Users className="w-4 h-4" /> Agents
            </TabsTrigger>
          )}

          {userPermissions.includes("Services") && (
            <TabsTrigger value="services">
              <Heart className="w-4 h-4" /> Services
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

          {userPermissions.includes("Settings") && (
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" /> Settings
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
                  <CardTitle>Active Agents</CardTitle>
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
                {loading ? (
                  <p>Loading agents...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 px-3">Agent</th>
                        <th className="py-2 px-3">Contact</th>
                        <th className="py-2 px-3">Location</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Today's Calls</th>
                        <th className="py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent) => (
                        <tr key={agent.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{agent.name}</td>
                          <td className="py-2 px-3">
                            <p>{agent.email}</p>
                            <p className="text-xs text-gray-500">{agent.mobile}</p>
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
                            <Button size="sm" variant="outline"><Phone className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                           <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePermissionClick(agent)} // Pass clicked agent
                      >
                        <Shield className="w-4 h-4" />
                        Permission
                      </Button>


      {/* Permission Modal (Popup) */}
                  {permissionModalOpen && (
                 <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                {/* The above wrapper keeps it centered but no background overlay */}

                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl pointer-events-auto">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Assign Permissions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 1. Action Permissions */}
                    <div>
                      <h3 className="bg-green-600 text-white font-bold px-4 py-2 rounded-md mb-4">
                        Action
                      </h3>
                      {['SMS', 'Chat', 'WhatsApp'].map((name) => {
                        const permission = permissionsList.find((p) => p.name === name);
                        if (!permission) return null;
                        return (
                          <div
                            key={permission.id}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <span className="text-gray-700">{permission.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                              />
                              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-700 transition-all duration-300"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    {/* 2. Dashboard Permissions */}
                    <div>
                      <h3 className="bg-green-600 text-white font-bold px-4 py-2 rounded-md mb-4">
                        Dashboard
                      </h3>
                      {['Overview', 'Services', 'Agents', 'Reports'].map((name) => {
                        const permission = permissionsList.find((p) => p.name === name);
                        if (!permission) return null;
                        return (
                          <div
                            key={permission.id}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <span className="text-gray-700">{permission.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                              />
                              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-700 transition-all duration-300"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    {/* 3. Mobile Permissions */}
                    <div>
                      <h3 className="bg-green-600 text-white font-bold px-4 py-2 rounded-md mb-4">
                        Mobile Permissions
                      </h3>
                      {permissionsList
                        .filter((p) => p.category === 'mobile')
                        .map((permission) => (
                          <div
                            key={permission.id}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <span className="text-gray-700">{permission.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                              />
                              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-700 transition-all duration-300"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-end mt-10 space-x-4">
                   <button
                    onClick={handleAssignPermissions}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Assign
                  </button>
                    <button
                      onClick={() => setPermissionModalOpen(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Cancel
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
                        link.href = "/demo.xlsx"; // path in public folder
                        link.download = "demo.xlsx";
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Agent" : "Add New Agent"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {step === 1 && (
              <>
                <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Mobile</Label><Input value={form.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
                <div><Label>Address</Label><Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                <div><Label>State</Label><Input value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              </>
            )}
            {step === 2 && (
              <>
                <div><Label>Password</Label><Input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
                <div><Label>Confirm Password</Label><Input type="password" value={form.confirmPassword || ""} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></div>
              </>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            {step === 1 && !isEdit && <Button onClick={() => setStep(2)}>Next</Button>}
            {(step === 2 || isEdit) && <Button onClick={handleSubmit}>{isEdit ? "Update Agent" : "Add Agent"}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
