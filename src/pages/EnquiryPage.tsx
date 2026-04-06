import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";
import { Phone, MessageSquare, Mail, Edit, Trash2, MessageCircle, Upload, Download } from "lucide-react";
import { FaWhatsapp, FaFilePdf } from "react-icons/fa";

type QuoteRow = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  insurance_type: string;
  message: string;
  created_at: string;
  updated_at: string;
};

const COLUMNS = ["id", "name", "mobile", "email", "insurance_type", "message", "created_at", "Actions"];

const EnquiryPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    axios.get("https://insuranceapp.tommyandfurry.com/api/quotes")
      .then((res) => setRows(res.data?.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const insuranceTypes = ["All", ...Array.from(new Set(rows.map((r) => r.insurance_type).filter(Boolean))).sort()];

  const filtered = rows.filter((r) => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s || Object.values(r).some((v) => String(v).toLowerCase().includes(s));
    const matchType = typeFilter === "All" || r.insurance_type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const whatsappLink = (mobile: string) =>
    `https://wa.me/${mobile}?text=${encodeURIComponent("https://insurance.tommyandfurry.com/tommyandfurryuat")}`;

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [remarkRow, setRemarkRow] = useState<QuoteRow | null>(null);
  const [remark, setRemark] = useState("");
  const [sendingRemark, setSendingRemark] = useState(false);

  const handleSendRemark = async () => {
    if (!remark.trim() || !remarkRow) return;
    setSendingRemark(true);
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const now = new Date().toISOString();
      await axios.post("https://collectkart.docboyz.in/api/send-enquieryremark", {
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

  // Download demo Excel with correct headers
  const handleDownloadDemo = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["name", "mobile", "email", "insurance_type", "message"],
      ["John Doe", "9876543210", "john@example.com", "Motor Insurance", "Need motor insurance quote"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enquiry");
    XLSX.writeFile(wb, "enquiry_template.xlsx");
  };

  // Upload Excel and send to API
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      // Send as FormData with the original file
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("https://insuranceapp.tommyandfurry.com/api/quotes-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ ${data.length} records uploaded successfully!`);
      // Refresh table
      const res = await axios.get("https://insuranceapp.tommyandfurry.com/api/quotes");
      setRows(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Please check the file format.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
      <DashboardHeader />
      <div className="px-6 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-sky-700 to-blue-900 rounded-2xl shadow-lg p-6 flex justify-between items-center mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">📋 Enquiry</h1>
          <button onClick={() => navigate("/dashboard")} className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-sky-100 text-sm">
            ← Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500">
            {insuranceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" placeholder="Search..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[5, 10, 20, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-x-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3">
            <h2 className="text-lg font-semibold">Enquiry Table</h2>
            <div className="flex items-center gap-2">
              {/* Download demo */}
              <button onClick={handleDownloadDemo}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition">
                <Download className="w-4 h-4" />
                Download Template
              </button>
              {/* Upload Excel */}
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Excel"}
              </button>
            </div>
            <span className="text-sm text-gray-500">{filtered.length} records</span>
          </div>
          {loading ? (
            <p className="text-center py-10 text-gray-400">Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-sky-100/60 text-blue-900">
                  <tr className="border-b border-blue-200">
                    <th className="py-3 px-3"><input type="checkbox" /></th>
                    {COLUMNS.map((col) => (
                      <th key={col} className="py-3 px-3 font-semibold whitespace-nowrap capitalize">
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length > 0 ? paginated.map((row, idx) => (
                    <tr key={row.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                      <td className="py-2 px-3"><input type="checkbox" /></td>
                      {COLUMNS.map((col) => {
                        if (col === "name") return (
                          <td key={col} className="py-2 px-3 text-blue-600 font-medium whitespace-nowrap">{row.name}</td>
                        );
                        if (col === "Actions") return (
                          <td key={col} className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleClickToCall(row.mobile)} title="Call" className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition">
                                <Phone className="w-3.5 h-3.5" />
                              </button>
                              <button title="SMS" className="w-7 h-7 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <a href={whatsappLink(row.mobile)} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                                className="w-7 h-7 rounded-md bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition">
                                <FaWhatsapp className="w-3.5 h-3.5" />
                              </a>
                              <a href={`mailto:${row.email}`} title="Email" className="w-7 h-7 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition">
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                              <button title="Edit" className="w-7 h-7 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center hover:bg-amber-200 transition">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button title="Remark" onClick={() => { setRemarkRow(row); setRemark(""); }} className="w-7 h-7 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition">
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <button title="Delete" className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <a href="/170864268_20250820T183537.pdf" target="_blank" rel="noopener noreferrer" title="PDF"
                                className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition">
                                <FaFilePdf className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        );
                        return <td key={col} className="py-2 px-3 whitespace-nowrap">{(row as any)[col] ?? ""}</td>;
                      })}
                    </tr>
                  )) : (
                    <tr><td colSpan={COLUMNS.length + 1} className="text-center py-8 text-gray-400">No records found.</td></tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 flex-wrap gap-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50">← Previous</button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages} · {filtered.length} total</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50">Next →</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Send Remark Modal */}
      {remarkRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Send Remark</h2>
                <p className="text-sky-100 text-xs">{remarkRow.name}</p>
              </div>
              <button onClick={() => { setRemarkRow(null); setRemark(""); }} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Write your remark here..."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => { setRemarkRow(null); setRemark(""); }}
                  className="px-5 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition">
                  Cancel
                </button>
                <button onClick={handleSendRemark} disabled={!remark.trim() || sendingRemark}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {sendingRemark ? "Sending..." : "Send Remark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AppFooter />
    </div>
  );
};

export default EnquiryPage;
