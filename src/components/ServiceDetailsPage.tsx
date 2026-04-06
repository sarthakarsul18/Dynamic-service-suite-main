import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";

const API_BASE = "https://collectkart.docboyz.in/api";
const API_URL = `${API_BASE}/service-pricesdashboard`;

const COLUMNS = [
  "name",
  "price",
  "discount",
  "description",
  "pincode",
  "city",
  "state",
  "image",
  "Action",
];

const ServiceDetailsPage = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const recordsPerPage = 8;

  // Fetch all data
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setRows(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add record
  const handleAdd = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${API_URL}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAddModal(false);
      setForm({});
      setImageFile(null);
      fetchData();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  // Update record
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${API_URL}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditModal(false);
      setForm({});
      setImageFile(null);
      fetchData();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Delete record
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Filtering + pagination
  const filtered = rows.filter((r) =>
    COLUMNS.some(
      (col) =>
        col !== "Action" &&
        String(r[col] || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const paginatedRows = filtered.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-8">
      {/* -------- HEADER STRIP -------- */}
      <div className="bg-gradient-to-r from-sky-700 to-blue-900 rounded-2xl shadow-lg p-6 flex justify-between items-center w-full flex-wrap gap-3 mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-wide flex items-center gap-2">
          🏷️ Service Details
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="secondary"
            className="bg-white text-blue-700 font-semibold shadow-md hover:bg-sky-100"
          >
            ← Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              setForm({});
              setImageFile(null);
              setAddModal(true);
            }}
            className="bg-white text-blue-700 font-semibold shadow-md hover:bg-sky-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </div>
      </div>

      {/* -------- SEARCH BAR -------- */}
      <div className="mb-5">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-4 py-2 w-full"
        />
      </div>

      {/* -------- TABLE -------- */}
      <Card className="border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Services Table
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-sky-100/60 text-blue-900 border-b border-blue-200">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className="py-3 px-4 text-left capitalize">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-blue-100 hover:bg-blue-50 transition"
                  >
                    {COLUMNS.map((col) =>
                      col === "Action" ? (
                        <td key={col} className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => {
                              setForm(r);
                              setEditModal(true);
                            }}
                            title="Edit"
                          >
                            <Edit className="text-amber-600 inline w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            title="Delete"
                          >
                            <Trash2 className="text-gray-700 inline w-5 h-5" />
                          </button>
                        </td>
                      ) : col === "image" ? (
                        <td key={col} className="py-3 px-4">
                          {r.image ? (
                            <img
                              src={`${API_BASE}/storage/${r.image}`}
                              alt="Service"
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      ) : (
                        <td key={col} className="py-3 px-4">
                          {r[col]}
                        </td>
                      )
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-center text-muted-foreground py-6"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* -------- PAGINATION -------- */}
          <div className="flex justify-between items-center p-4 flex-wrap gap-3">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="outline"
            >
              ← Previous
            </Button>
            <span className="text-gray-600">
              Page {page} of {totalPages || 1} · Total rows: {filtered.length}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              variant="outline"
            >
              Next →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* -------- ADD MODAL -------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-3"
          >
            {["category","name", "price", "discount", "description", "pincode", "city", "state"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field}
                  </label>
                  <Input
                    type={field === "price" || field === "discount" ? "number" : "text"}
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required={["name", "price"].includes(field)}
                  />
                </div>
              )
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white">
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------- EDIT MODAL -------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-3"
          >
            {["category","name", "price", "discount", "description", "pincode", "city", "state"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field}
                  </label>
                  <Input
                    type={field === "price" || field === "discount" ? "number" : "text"}
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              )
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
              {form.image && (
                <img
                  src={`${API_BASE}/storage/${form.image}`}
                  alt="Service"
                  className="mt-2 h-12 rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white">
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetailsPage;
