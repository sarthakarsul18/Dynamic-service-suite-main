import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Phone, MessageSquare, Mail, Edit, Trash2, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaFilePdf } from "react-icons/fa";

const SERVICE_COLUMNS = [
  "Owner_Name", "Address", "District", "Status", "State",
  "Pincode", "Mobile_No", "Services_Offered_Type", "Action"
];

const AGENT_COLUMNS = [
  "name", "email", "mobile", "city", "state",
  "pincode", "status", "agent_type", "Action"
];

type ServiceRow = { id: string | number; [key: string]: any };

const ServiceVendorType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const passedRows: ServiceRow[] = location?.state?.rows || [];
  const passedCategory: string = location?.state?.category || "";
  const tableType: string = location?.state?.tableType || "services";
  const isAgents = tableType === "agents";
  const COLUMNS = isAgents ? AGENT_COLUMNS : SERVICE_COLUMNS;

  const [rows, setRows] = useState<ServiceRow[]>(passedRows || []);
  const [loading, setLoading] = useState(passedRows.length === 0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [modalRow, setModalRow] = useState<ServiceRow | null>(null);
  const [editRow, setEditRow] = useState<ServiceRow | null>(null);
  const [editForm, setEditForm] = useState<ServiceRow>({} as ServiceRow);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [remarkRow, setRemarkRow] = useState<ServiceRow | null>(null);
  const [remark, setRemark] = useState("");
  const [sendingRemark, setSendingRemark] = useState(false);

  const onboardingLink = isAgents 
    ? "https://insurance.tommyandfurry.com/db/#/auth/signin"
    : "https://insurance.tommyandfurry.com/tommyandfurryuat/#/";

  const getCell = (row: ServiceRow, key: string) => {
    if (!row) return "";
    if (row[key] !== undefined && row[key] !== null) return row[key];
    const lower = key.toLowerCase();
    if (row[lower] !== undefined) return row[lower];
    const compact = key.replace(/_/g, "").toLowerCase();
    for (const k of Object.keys(row)) {
      if (k.replace(/_/g, "").toLowerCase() === compact) return row[k];
    }
    return "";
  };

  useEffect(() => {
    setServiceFilter(isAgents ? "All Agents" : "All Services");
  }, [isAgents]);

  useEffect(() => {
    if (passedRows.length) return;
    const fetchRows = async () => {
      try {
        setLoading(true);
        const resp = await axios.post("https://collectkart.docboyz.in/api/servicedata-demo", {
          category: passedCategory || null
        });
        const data: any[] = Array.isArray(resp.data) ? resp.data : (resp.data.data || []);
        setRows(data.map((row, index) => ({ id: row.id || index, ...row })));
      } catch (err) {
        console.error("Failed to fetch rows:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRows();
  }, [passedRows, passedCategory]);

  const filterOptions = useMemo(() => {
    if (isAgents) {
      const types = new Set<string>();
      rows.forEach((row) => {
        const val = String(getCell(row, "agent_type") || "").trim();
        if (val && val !== "null" && val !== "NUL" && val !== "undefined") types.add(val);
      });
      return ["All Agents", ...Array.from(types).sort()];
    } else {
      const types = new Set<string>();
      rows.forEach((row) => {
        const val = String(getCell(row, "Services_Offered_Type") || "").trim();
        if (val) types.add(val);
      });
      return ["All Services", ...Array.from(types).sort()];
    }
  }, [rows, isAgents]);

  const filteredRows = rows.filter((row) => {
    const matchesSearch = COLUMNS.some((col) =>
      col !== "Action" &&
      String(getCell(row, col)).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterDefault = isAgents ? "All Agents" : "All Services";
    const filterCol = isAgents ? "agent_type" : "Services_Offered_Type";
    const matchesFilter = !serviceFilter || serviceFilter === filterDefault ||
      String(getCell(row, filterCol)).trim() === serviceFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / recordsPerPage));
  const paginatedRows = filteredRows.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const toggleSelectAllPage = (checked: boolean) => {
    const ids = paginatedRows.map((_, idx) => (page - 1) * recordsPerPage + idx);
    setSelectedRows((prev) =>
      checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id))
    );
  };

  const toggleSelectRow = (id: number, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((i) => i !== id)
    );
  };

  const handleEditClick = (row: ServiceRow) => { setEditRow(row); setEditForm(row); };
  const handleChange = (field: string, value: any) => setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleUpdate = async () => {
    try {
      await axios.post("https://collectkart.docboyz.in/api/servicedata-update", editForm);
      setRows((prev) => prev.map((r) => r.id === editForm.id ? editForm : r));
      setEditRow(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSendRemark = async () => {
    if (!remark.trim() || !remarkRow) return;
    setSendingRemark(true);
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const now = new Date().toISOString();
      const endpoint = isAgents
        ? "https://collectkart.docboyz.in/api/send-remarkagent"
        : "https://collectkart.docboyz.in/api/send-remarkversion";
      await axios.post(endpoint, {
        receiver_id: parsedUser?.id ?? null,
        register_id: remarkRow.id,
        remark: remark.trim(),
        sender_name: parsedUser?.name ?? "Admin",
        created_at: now,
        updated_at: now,
      });
      alert("✅ Remark sent successfully!");
      setRemarkRow(null);
      setRemark("");
    } catch (err) {
      console.error("Send remark failed", err);
      alert("❌ Failed to send remark.");
    } finally {
      setSendingRemark(false);
    }
  };

  const renderStatus = (val: any) => {
    const active = val == 1 || val === "1" || String(val).toLowerCase() === "active";
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
        {active ? "Active" : "Inactive"}
      </span>
    );
  };

  const getMobile = (row: ServiceRow) =>
    isAgents ? String(getCell(row, "mobile") || "") : String(getCell(row, "Mobile_No") || "");

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

  const nameCol = isAgents ? "name" : "Owner_Name";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-10">
      {/* Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-sky-700 to-blue-900 rounded-2xl shadow-lg p-6 flex justify-between items-center w-full flex-wrap gap-3">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            {isAgents ? "👤 POSP Agents" : "📋 Lead Type"}
          </h1>
          <span className="text-white text-sm">Category: <span className="font-semibold">{passedCategory || "All"}</span></span>
          <Button variant="secondary" onClick={() => navigate("/dashboard?tab=services")} className="bg-white text-blue-600 font-semibold shadow-md hover:bg-sky-100">
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={serviceFilter}
          onChange={(e) => { setServiceFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <Card className="overflow-x-auto border border-gray-200 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{isAgents ? "Agents Table" : "Services Table"}</CardTitle>
            <span className="text-sm text-gray-500">{filteredRows.length} records</span>
          </div>
        </CardHeader>
        <CardContent className="bg-sky-50/40 rounded-md p-0">
          {loading ? (
            <p className="text-center py-6 text-muted-foreground">Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-sky-100/60 text-blue-900">
                  <tr className="border-b border-blue-200">
                    <th className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={paginatedRows.length > 0 && paginatedRows.every((_, idx) => selectedRows.includes((page - 1) * recordsPerPage + idx))}
                        onChange={(e) => toggleSelectAllPage(e.target.checked)}
                      />
                    </th>
                    {COLUMNS.map((col) => (
                      <th key={col} className="py-3 px-3 font-semibold whitespace-nowrap capitalize">
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? paginatedRows.map((row, idx) => {
                    const globalIdx = (page - 1) * recordsPerPage + idx;
                    const mobile = getMobile(row);
                    return (
                      <tr key={idx} className="border-b border-blue-100 hover:bg-blue-50 transition">
                        <td className="py-2 px-3">
                          <input type="checkbox" checked={selectedRows.includes(globalIdx)} onChange={(e) => toggleSelectRow(globalIdx, e.target.checked)} />
                        </td>
                        {COLUMNS.map((col) => {
                          if (col === nameCol) {
                            return (
                              <td key={col} className="py-2 px-3 text-blue-600 underline cursor-pointer font-medium whitespace-nowrap" onClick={() => setModalRow(row)}>
                                {getCell(row, col)}
                              </td>
                            );
                          }
                          if (col === "status") {
                            return <td key={col} className="py-2 px-3">{renderStatus(getCell(row, col))}</td>;
                          }
                          if (col === "Action") {
                            return (
                              <td key={col} className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleClickToCall(mobile)} title="Call" className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition">
                                    <Phone className="w-3.5 h-3.5" />
                                  </button>                                  <button title="SMS" onClick={() => console.log("SMS", row)} className="w-7 h-7 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                  <a href={`https://wa.me/${mobile}?text=${encodeURIComponent(onboardingLink)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-7 h-7 rounded-md bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition">
                                    <FaWhatsapp className="w-3.5 h-3.5" />
                                  </a>
                                  <button title="Email" onClick={() => console.log("Email", row)} className="w-7 h-7 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition">
                                    <Mail className="w-3.5 h-3.5" />
                                  </button>
                                  <button title="Edit" onClick={() => handleEditClick(row)} className="w-7 h-7 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center hover:bg-amber-200 transition">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button title="Send Remark" onClick={() => { setRemarkRow(row); setRemark(""); }} className="w-7 h-7 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button title="Delete" onClick={() => console.log("Delete", row.id)} className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <a href="/170864268_20250820T183537.pdf" target="_blank" rel="noopener noreferrer" title="View PDF" className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition">
                                    <FaFilePdf className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </td>
                            );
                          }
                          return <td key={col} className="py-2 px-3 whitespace-nowrap">{getCell(row, col)}</td>;
                        })}
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={COLUMNS.length + 1} className="text-center text-muted-foreground py-8">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 flex-wrap gap-2">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)} size="sm">← Previous</Button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages} · {filteredRows.length} total</span>
                <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} size="sm">Next →</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View modal */}
      <Dialog open={!!modalRow} onOpenChange={() => setModalRow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isAgents ? "Agent Details" : "Service Details"}</DialogTitle></DialogHeader>
          {modalRow && (
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {Object.entries(modalRow).map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm border-b pb-1">
                  <span className="font-medium text-gray-600 min-w-[160px]">{k}:</span>
                  <span>{String(v ?? "")}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={!!editRow} onOpenChange={() => setEditRow(null)}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Record</DialogTitle></DialogHeader>
          {editRow && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-3">
              {Object.entries(editForm).map(([k, v]) => {
                if (k === "id") return null;
                return (
                  <div key={k}>
                    <label className="text-sm font-medium block mb-1">{k}</label>
                    <Input value={v !== null && v !== undefined ? String(v) : ""} onChange={(e) => handleChange(k, e.target.value)} />
                  </div>
                );
              })}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setEditRow(null)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 text-white">Update</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Remark modal */}
      <Dialog open={!!remarkRow} onOpenChange={() => { setRemarkRow(null); setRemark(""); }}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              Send Remark to {remarkRow ? String(getCell(remarkRow, isAgents ? "name" : "Owner_Name")) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Write your remark here..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setRemarkRow(null); setRemark(""); }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!remark.trim() || sendingRemark}
                onClick={handleSendRemark}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {sendingRemark ? "Sending..." : "Send Remark"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceVendorType;
