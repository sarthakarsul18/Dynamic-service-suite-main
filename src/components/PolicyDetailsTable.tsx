import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Mail, Info, Edit, Trash2, FileText, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { FaWhatsapp,FaFilePdf } from "react-icons/fa";

const PolicyDetailsTable = () => {
  const navigate = useNavigate();
  const [selectedPolicies, setSelectedPolicies] = useState<number[]>([]);

  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  // ✅ Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  // ✅ Edit form state
  const [editForm, setEditForm] = useState<any>({});

  const [categoryFilter, setCategoryFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [holderFilter, setHolderFilter] = useState("");
  const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

// format yyyy-mm-dd
const todayStr = `${yyyy}-${mm}-${dd}`;

// get first day of month
const firstDayStr = `${yyyy}-${mm}-01`;
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState(firstDayStr);
const [endDate, setEndDate] = useState(todayStr);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Optional: redirect if no user is logged in
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.post(
          "https://insuranceapp.tommyandfurry.com/api/policydata"
        );
        if (Array.isArray(response.data)) {
          setPolicies(response.data);
        } else if (Array.isArray(response.data.data)) {
          setPolicies(response.data.data);
        } else {
          setPolicies([]);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  // ✅ Policy details dialog
  const handlePolicyClick = (policy: any) => {
    setSelectedPolicy(policy);
    setDialogOpen(true);
  };

  // ✅ Open Edit Dialog
  const handleEditClick = (policy: any) => {
    setSelectedPolicy(policy);
    setEditForm({ ...policy }); // pre-fill form
    setEditDialogOpen(true);
  };

  // ✅ Update policy API call
  const handleUpdatePolicy = async () => {
    try {
      await axios.put(
        `https://insuranceapp.tommyandfurry.com/api/policies/${editForm.id}`,
        editForm
      );

      // Update local state
      setPolicies((prev) =>
        prev.map((p) => (p.id === editForm.id ? editForm : p))
      );

      alert("Policy updated successfully ✅");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating policy:", error);
      alert("Failed to update policy ❌");
    }
  };

 const handleDeletePolicy = async (policyId: number) => {
  if (!window.confirm("Are you sure you want to delete this policy?")) return;

  try {
    // Dummy API call
    await axios.put(`https://insuranceapp.tommyandfurry.com/api/deletepolicies/${policyId}`);

    // Remove from local state
    setPolicies(policies.filter((p) => p.id !== policyId));

    // Optional: show success
    alert("Policy deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete policy.");
  }
};



  // ✅ Apply filters
  // const filteredPolicies = policies.filter((policy) => {
  //   const createdDate = policy.created_at
  //     ? policy.created_at.split(" ")[0]
  //     : "";
  //   return (
  //     (categoryFilter === "" || policy.category === categoryFilter) &&
  //     (agentFilter === "" || policy.agent === agentFilter) &&
  //     (dateFilter === "" || createdDate === dateFilter)
  //   );
  // });
  const filteredPolicies = policies.filter((policy) => {
  const createdDate = policy.created_at
    ? policy.created_at.split(" ")[0]
    : "";

  const isCategoryMatch =
    categoryFilter === "" || policy.category === categoryFilter;
  const isAgentMatch =
    agentFilter === "" || policy.agent === agentFilter;
  const isHolderMatch =
  holderFilter === "" || policy.holder === holderFilter;

  // ✅ Date range logic
  let isDateMatch = true;
  if (startDate && endDate) {
    isDateMatch =
      createdDate >= startDate && createdDate <= endDate;
  } else if (startDate) {
    isDateMatch = createdDate >= startDate;
  } else if (endDate) {
    isDateMatch = createdDate <= endDate;
  }

  return isCategoryMatch && isAgentMatch && isHolderMatch && isDateMatch;
});


  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredPolicies.length / recordsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  // ✅ Handle SMS/Email send
  const handleClickToCall = async (destinationPhone: string) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const agentNumber = parsedUser?.mobile || parsedUser?.phone || "";
    if (!agentNumber) { alert("Your mobile number is not set in profile."); return; }
    if (!destinationPhone) { alert("No phone number available for this policy."); return; }
    try {
      await axios.post("https://insuranceapp.tommyandfurry.com/api/click-to-call", {
        async: 1,
        agent_number: agentNumber,
        destination_number: destinationPhone,
        caller_id: "7965801284",
      });
      alert(`✅ Call initiated to ${destinationPhone}`);
    } catch (e) {
      console.error(e);
      alert("❌ Failed to initiate call.");
    }
  };

  const handleSendSms = () => {
    if (selectedPolicy) {
      alert(`SMS sent to ${selectedPolicy.phone}: ${message}`);
    }
    setSmsDialogOpen(false);
    setMessage("");
  };

  const handleSendEmail = () => {
    if (selectedPolicy) {
      alert(
        `Email sent to ${selectedPolicy.email}\nSubject: ${subject}\nMessage: ${message}`
      );
    }
    setEmailDialogOpen(false);
    setSubject("");
    setMessage("");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const POLICY_HEADERS = [
    "policy_number","category","holder","premium","status","phone","email","agent",
    "policy_date","description","pdf_link","address","pincode","state","district","city",
    "case_code","signup_id","company_name","vehicle_number","companySelected","IDVSelected",
    "quick_quote","create_quote","premiumSelected","kycCheckDone","payment_initiated",
    "payment_success","policyCreated"
  ];

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      POLICY_HEADERS,
      ["POL001","Motor","John Doe","5000","Active","9876543210","john@example.com","Agent1",
       "2026-01-01","Sample policy","","123 Street","411001","Maharashtra","Pune","Pune",
       "","","Company A","MH12AB1234","","","","","","","","",""]
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Policies");
    XLSX.writeFile(wb, "policies_template.xlsx");
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("https://insuranceapp.tommyandfurry.com/api/policies-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Policies uploaded successfully!");
      const response = await axios.post("https://insuranceapp.tommyandfurry.com/api/policydata");
      if (Array.isArray(response.data)) setPolicies(response.data);
      else if (Array.isArray(response.data.data)) setPolicies(response.data.data);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Please check the file format.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-10">
      
      {/* Header */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-sky-700 to-blue-900 rounded-2xl shadow-lg p-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white tracking-wide flex items-center gap-3">
            📋 Active Policies
          </h1>
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 font-semibold shadow-md hover:bg-sky-100"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8 shadow-lg border border-blue-100 bg-gradient-to-br from-sky-50 to-white rounded-2xl">
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          {/* Category Filter */}
          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Category</label>
            <select
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {[...new Set(policies.map((p) => p.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Agent Filter */}
          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Agent</label>
            <select
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={agentFilter}
              onChange={(e) => {
                setAgentFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Agents</option>
              {[...new Set(policies.map((p) => p.agent))].map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Holder</label>
            <select
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={holderFilter}
              onChange={(e) => {
                setHolderFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Holder</option>
              {[...new Set(policies.map((p) => p.holder))].map((holder) => (
                <option key={holder} value={holder}>
                  {holder}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          {/* <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Date</label>
            <input
              type="date"
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
            />
          </div> */}

          {/* Start Date Filter */}
          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Start Date</label>
            <input
              type="date"
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* End Date Filter */}
          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">End Date</label>
            <input
              type="date"
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>


          {/* Delete Filters Button */}
          <div className="flex items-end">
            <Button
              variant="destructive"
              // size="md"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all filters?")) {
                  setCategoryFilter("");
                  setAgentFilter("");
                  setHolderFilter("");
                  setDateFilter("");
                  setPage(1);
                }
              }}
            >
              Delete 
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Table */}
    <Card className="overflow-x-auto border border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg font-semibold text-foreground">Policy Table</CardTitle>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition">
              <Download className="w-4 h-4" /> Download Template
            </button>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Excel"}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="bg-sky-50/40 rounded-md p-0">
        {loading ? (
          <p className="text-center py-6 text-muted-foreground">
            Loading policies...
          </p>
        ) : (
          <>
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-sky-100/60 text-blue-900">
                <tr className="border-b border-blue-200">
                  <th className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={
                        paginatedPolicies.length > 0 &&
                        paginatedPolicies.every((p) => selectedPolicies.includes(p.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolicies(
                            paginatedPolicies.map((p) => p.id)
                          );
                        } else {
                          setSelectedPolicies([]);
                        }
                      }}
                    />
                  </th>
                  <th className="py-3 px-4">Policy ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Agent</th>
                  <th className="py-3 px-4">Holder</th>
                  <th className="py-3 px-4">Premium</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPolicies.length > 0 ? (
                  paginatedPolicies.map((policy) => (
                    <tr
                      key={policy.id}
                      className="border-b border-blue-100 hover:bg-blue-50 transition"
                    >
                      {/* ✅ Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedPolicies.includes(policy.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPolicies([...selectedPolicies, policy.id]);
                            } else {
                              setSelectedPolicies(
                                selectedPolicies.filter((id) => id !== policy.id)
                              );
                            }
                          }}
                        />
                      </td>

                      <td
                        className="py-3 px-4 text-primary font-medium cursor-pointer hover:underline"
                        onClick={() => handlePolicyClick(policy)}
                      >
                        {policy.policy_number}
                      </td>
                      <td className="py-3 px-4">{policy.category}</td>
                      <td className="py-3 px-4">{policy.agent}</td>
                      <td className="py-3 px-4">{policy.holder}</td>
                      <td className="py-3 px-4">{policy.premium}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{policy.status}</Badge>
                      </td>
                      <td className="py-3 px-4">{policy.phone}</td>
                      <td className="py-3 px-4 space-x-3 text-muted-foreground">
                        <button
                          onClick={() => handleClickToCall(policy.phone)}
                          title="Call"
                          className="text-blue-600"
                        >
                          <Phone className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            setSmsDialogOpen(true);
                          }}
                          title="SMS"
                          className="text-purple-600"
                        >
                          <MessageSquare className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                        <a
                          href={`https://wa.me/${policy.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="text-green-600"
                        >
                          <FaWhatsapp className="inline w-5 h-5 hover:scale-110 transition" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            setEmailDialogOpen(true);
                          }}
                          title="Email"
                          className="text-red-600"
                        >
                          <Mail className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                        <button
                          onClick={() => handleEditClick(policy)}
                          title="Edit"
                          className="text-amber-600"
                        >
                          <Edit className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                        <button
                              onClick={() => handleDeletePolicy(policy.id)}
                              title="Delete"
                              className="text-gray-600"
                            >
                          <Trash2 className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                        <a
                          href="/170864268_20250820T183537.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View PDF"
                          className="text-indigo-600"
                        >
                          <FaFilePdf  className="inline w-5 h-5 hover:scale-110 transition" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center text-muted-foreground py-6"
                    >
                      No policies found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-between items-center p-4 flex-wrap gap-2">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Previous
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages} · {filteredPolicies.length} total
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setPage(1); }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {[5, 10, 20, 50, 100].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next →
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>


      {/* Policy Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-sky-50 shadow-2xl rounded-2xl border border-blue-100">
          <DialogHeader className="border-b pb-3 mb-4">
            <DialogTitle className="flex items-center gap-3 text-blue-700 text-xl font-bold">
              <Info className="w-6 h-6 text-blue-600" />
              Policy Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Full policy information for{" "}
              <span className="font-semibold text-blue-600">
                {selectedPolicy?.policy_number}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Policy ID</p>
                <p className="font-semibold text-blue-700">{selectedPolicy.id}</p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold">{selectedPolicy.category}</p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Agent</p>
                <p className="font-semibold">{selectedPolicy.agent}</p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Holder</p>
                <p className="font-semibold">{selectedPolicy.holder}</p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Premium</p>
                <p className="font-semibold text-green-700">
                  ₹{selectedPolicy.premium}
                </p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Status</p>
                <Badge variant="outline" className="text-blue-700 border-blue-400">
                  {selectedPolicy.status}
                </Badge>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm col-span-2">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {selectedPolicy.phone}
                </p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm col-span-2">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  {selectedPolicy.email}
                </p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="font-medium text-gray-700">
                  {selectedPolicy.description}
                </p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm col-span-2">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="font-medium">{selectedPolicy.created_at}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ SMS Dialog */}
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              Send message to {selectedPolicy?.phone}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSendSms}>Send SMS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send email to {selectedPolicy?.email}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Edit Dialog */}
      {/* ✅ Edit Dialog - Large & Scrollable */}
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-sky-50 shadow-2xl rounded-2xl border border-blue-100 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-blue-700 flex items-center gap-3">
            <Edit className="w-6 h-6 text-amber-600" /> Edit Policy
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update details of policy{" "}
            <span className="font-semibold text-blue-600">
              {editForm.policy_number}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form - Auto-generate inputs for all keys */}
        <div className="grid grid-cols-2 gap-4">
          {editForm &&
            Object.keys(editForm).map((key) => {
              // Skip nested objects or arrays
              if (
                typeof editForm[key] === "object" &&
                editForm[key] !== null
              )
                return null;

              return (
                <div key={key} className="flex flex-col">
                  <label className="text-xs text-gray-500 capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </label>
                  <Input
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [key]: e.target.value })
                    }
                  />
                </div>
              );
            })}
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setEditDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdatePolicy}>Update Policy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </div>
  );
};

export default PolicyDetailsTable;
