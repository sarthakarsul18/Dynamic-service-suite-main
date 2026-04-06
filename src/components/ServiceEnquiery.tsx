import { useState, useEffect } from "react";
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
import { Phone, MessageSquare, Mail, Info, Edit, Trash2, FileText,UserPlus   } from "lucide-react";
import { FaWhatsapp,FaFilePdf } from "react-icons/fa";

const ServiceEnquiery = () => {
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
  const [assignModalOpen, setAssignModalOpen] = useState(false); // Modal for assigning
  const [selectedPerson, setSelectedPerson] = useState(null);

  const demoIndianNames = [
    { id: 1, name: 'Amit Sharma' },
    { id: 2, name: 'Priya Reddy' },
    { id: 3, name: 'Pritesh Mehetre' },
    { id: 4, name: 'Amol Sathe' },
    { id: 5, name: 'Aniket Raw' },
    { id: 6, name: 'Dipak Shinde' },
    { id: 7, name: 'Pritesh Patil' },
    { id: 8, name: 'Rahul Lage' },
    { id: 9, name: 'Sanjay Shirsath' },
    // Add more names as needed
  ];

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
    // const [dateFilter, setDateFilter] = useState(() => {
    //   const today = new Date();
    //   return today.toISOString().split("T")[0];
    // });
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  const handleSelectPerson = (e) => {
    const selectedId = e.target.value;
    setSelectedPerson(demoIndianNames.find((person) => person.id === parseInt(selectedId)));
  };

  // Handle Assign button logic
  const handleAssign = () => {
    if (selectedPerson) {
      console.log(`Assigned ${selectedPerson.name} to policy ${name}`);
      setAssignModalOpen(false); // Close the modal after assigning
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.post(
          "https://collectkart.docboyz.in/api/servicedata"
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
        `https://collectkart.docboyz.in/api/editservicedata/${editForm.id}`,
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
    await axios.put(`https://collectkart.docboyz.in/api/deleteservicedata/${policyId}`);

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
  //     (agentFilter === "" || policy.assign_to === agentFilter) &&
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
  holderFilter === "" || policy.name === holderFilter;

  let isDateMatch = true;
  if (startDate && endDate) {
    isDateMatch = createdDate >= startDate && createdDate <= endDate;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-sky-700 to-blue-900 rounded-2xl shadow-lg p-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white tracking-wide flex items-center gap-3">
            📋 Service Enquiery
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
              {[...new Set(policies.map((p) => p.service_type))].map((cat) => (
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
              <option value="">All Agent</option>
              {[...new Set(policies.map((p) => p.assign_to))].map((assign_to) => (
                <option key={assign_to} value={assign_to}>
                  {assign_to}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">Name</label>
            <select
              className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
              value={holderFilter}
              onChange={(e) => {
                setHolderFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              {[...new Set(policies.map((p) => p.name))].map((name) => (
                <option key={name} value={name}>
                  {name}
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
        <CardTitle className="text-lg font-semibold text-foreground">
          Services Table
        </CardTitle>
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
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Assign To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Email</th>
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
                        {policy.name}
                      </td>
                      <td className="py-3 px-4">{policy.service_type}</td>
                      <td className="py-3 px-4">{policy.assign_to}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{policy.status}</Badge>
                      </td>
                      <td className="py-3 px-4">{policy.phone}</td>
                      <td className="py-3 px-4">{policy.email}</td>
                      <td className="py-3 px-4 space-x-3 text-muted-foreground">
                        <a
                          href={`tel:${policy.phone}`}
                          title="Call"
                          className="text-blue-600"
                        >
                          <Phone className="inline w-5 h-5 hover:scale-110 transition" />
                        </a>
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
                       <button
                            onClick={() => setAssignModalOpen(true)} // Open the assign modal
                            className="text-blue-600 ml-4"
                            title="Assign Action"
                        >
                        <UserPlus  className="inline w-5 h-5 hover:scale-110 transition" />
                        </button>
                          
      {/* Assign Modal (Popup) */}
      {assignModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Assign Person</h3>
            <select
              onChange={handleSelectPerson}
              className="form-select w-full mb-4 p-2 border rounded"
            >
              <option value="">Select a person</option>
              {demoIndianNames.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            {/* Display selected person */}
            {selectedPerson && <p className="mb-4">Selected: {selectedPerson.name}</p>}

            {/* Assign and Close buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleAssign}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!selectedPerson}
              >
                Assign
              </button>
              <button
                onClick={() => setAssignModalOpen(false)} // Close the modal
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
            <div className="flex justify-between items-center p-4">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Previous
              </Button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
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
              Service Details
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
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold">{selectedPolicy.name}</p>
              </div>
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold">{selectedPolicy.service_type}</p>
              </div>
              
              <div className="bg-sky-100/60 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500">agent</p>
                <p className="font-semibold">{selectedPolicy.assign_to}</p>
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
                  {selectedPolicy.contact}
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
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-medium text-gray-700">
                  {selectedPolicy.amount}
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

export default ServiceEnquiery;
