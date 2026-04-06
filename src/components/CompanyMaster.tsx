import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: number;
  company_name: string;
  licence_number: string;
  certification: string;
  pan_number: string;
  adhar_number: string;
  services: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  parent_name?: string; // optional parent name
}
interface PermissionResponse {
  permissions: string[];
}

const CompanyMaster = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(null);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* ====== ADD COMPANY STATE ====== */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [addForm, setAddForm] = useState({
  name: "",
  email: "",
  password: "",           // password
  mobile: "",             // mobile
  company_name: "",
  licence_number: "",
  certification: "",
  pan_number: "",
  adhar_number: "",
  bank_account_name: "",
  bank_account_no: "",
  ifsc_code: "",
  gstin: "",
  services: "",
  address: "",            // address
  pincode: "",            // pincode
});
  /* =============================== */
  /* ===== PERMISSION STATE (ADD ONLY) ===== */
const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
const [permissionCompanyId, setPermissionCompanyId] = useState<number | null>(null);
// const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);


// const ALL_PERMISSIONS = [
//   "SMS",
//   "CHAT",
//   "WHATSAPP",
//   "OVERVIEW",
//   "SERVICES",
//   "AGENTS",
//   "REPORTS",
//   "POLICY_GODIGIT",
//   "POLICY_FG",
//   "POLICY_BAJAJ",
// ];

const ALL_PERMISSIONS = [
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


  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await fetch("https://collectkart.docboyz.in/api/get-companies");
      const data = await res.json();
      setCompanies(data.data || []);
    } catch (error) {
      toast({ title: "Failed to fetch companies", variant: "destructive" });
    }
  };

  // Fetch users for a company
  const fetchCompanyUsers = async (companyId: number) => {
    try {
      const res = await fetch(`https://collectkart.docboyz.in/api/get-users-by-company/${companyId}`);
      const data = await res.json();
      setCompanyUsers(data.data || []);
    } catch (error) {
      toast({ title: "Failed to fetch users", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyClick = (companyId: number) => {
    if (expandedCompanyId === companyId) {
      setExpandedCompanyId(null);
      setCompanyUsers([]);
    } else {
      setExpandedCompanyId(companyId);
      fetchCompanyUsers(companyId);
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`https://collectkart.docboyz.in/api/delete-company/${companyId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Company deleted successfully" });
        fetchCompanies();
        if (expandedCompanyId === companyId) setExpandedCompanyId(null);
      } else {
        toast({ title: data.message || "Failed to delete company", variant: "destructive" });
      }
    } catch {
      toast({ title: "Server error", variant: "destructive" });
    }
  };

//  const handlePermission = async (companyId: number) => {
//   setPermissionCompanyId(companyId);
//   setIsPermissionModalOpen(true);
//   setSelectedPermissions([]);

//   try {
//     const res = await fetch(
//       `https://collectkart.docboyz.in/api/custom-permissions/${companyId}`
//     );
//     const data = await res.json();

//     if (data?.permissions) {
//       setSelectedPermissions(data.permissions);
//     }
//   } catch {
//     toast({ title: "Failed to load permissions", variant: "destructive" });
//   }
// };

const handlePermission = async (companyId: number) => {
  setPermissionCompanyId(companyId);
  setSelectedPermissions([]);
  setIsPermissionModalOpen(true);

  try {
    const res = await fetch(
      `https://collectkart.docboyz.in/api/custom-permissions/${companyId}`
    );
    const data = await res.json();

    if (Array.isArray(data.permissions)) {
      // convert permission name → permission ID
      const ids = data.permissions
        .map((p: any) =>
          ALL_PERMISSIONS.find(ap => ap.name === p.permission)?.id
        )
        .filter(Boolean);

      setSelectedPermissions(ids);
    }
  } catch {
    alert("Failed to load permissions");
  }
};


// const handlePermission = async (companyId: number) => {
//   setPermissionCompanyId(companyId);
//   setSelectedPermissions([]);        // reset first
//   setIsPermissionModalOpen(true);  
//      // open modal AFTER reset

//   try {
//     const res = await fetch(
//       `https://collectkart.docboyz.in/api/custom-permissions/${companyId}`
//     );
//     const data: PermissionResponse = await res.json();

//     if (Array.isArray(data.permissions)) {
//       setSelectedPermissions(data.permissions);
//     } else {
//       setSelectedPermissions([]);
//     }
//   } catch (error) {
//     toast({
//       title: "Failed to load permissions",
//       variant: "destructive",
//     });
//   }
// };


  const openEditModal = (company: Company) => {
    setEditCompany(company);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCompany(null);
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editCompany) return;
    setEditCompany({ ...editCompany, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCompany) return;
    try {
      const res = await fetch(`https://collectkart.docboyz.in/api/update-company/${editCompany.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCompany),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Company updated successfully" });
        fetchCompanies();
        closeEditModal();
      } else {
        toast({ title: data.message || "Update failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Server error", variant: "destructive" });
    }
  };

  /* ====== ADD COMPANY HANDLERS ====== */
const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setAddForm({ ...addForm, [e.target.name]: e.target.value });
};


  const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("https://collectkart.docboyz.in/api/register-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    const data = await res.json();
    if (res.ok) {
      toast({ title: "Company added successfully" });
      setIsAddModalOpen(false);
      setAddForm({
         name: "",
  email: "",
  password: "",           // password
  mobile: "",             // mobile
  company_name: "",
  licence_number: "",
  certification: "",
  pan_number: "",
  adhar_number: "",
  bank_account_name: "",
  bank_account_no: "",
  ifsc_code: "",
  gstin: "",
  services: "",
  address: "",            // address
  pincode: "",  
      });
      fetchCompanies();
    } else {
      toast({ title: data.message || "Failed to add company", variant: "destructive" });
    }
  } catch {
    toast({ title: "Server error", variant: "destructive" });
  }
};
  /* ================================ */

  const filteredCompanies = companies.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Company Master</h1>

      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Search Company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button className="bg-gradient-primary text-white" onClick={() => setIsAddModalOpen(true)}>
          Add New Company
        </Button>
        <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 font-semibold shadow-md hover:bg-sky-100"
          >
            ← Back to Dashboard
          </Button>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Company Name</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Licence Number</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Certification</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">PAN</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Aadhar</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Service Type</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Created At</th>
            <th className="px-4 py-2 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((company) => (
            <Fragment key={company.id}>
              <tr className="hover:bg-gray-50 cursor-pointer border-b border-gray-200">
                <td onClick={() => handleCompanyClick(company.id)} className="px-4 py-3 text-blue-600 font-semibold hover:underline">
                  {company.company_name}
                </td>
                <td className="px-4 py-3">{company.licence_number}</td>
                <td className="px-4 py-3">{company.certification}</td>
                <td className="px-4 py-3">{company.pan_number}</td>
                <td className="px-4 py-3">{company.adhar_number}</td>
                <td className="px-4 py-3">{company.services}</td>
                <td className="px-4 py-3">{new Date(company.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <button className="bg-green-600 text-white p-1 rounded" onClick={(e) => { e.stopPropagation(); openEditModal(company); }}>
                    <Edit size={16} />
                  </button>
                  <button className="bg-red-600 text-white p-1 rounded" onClick={(e) => { e.stopPropagation(); handleDeleteCompany(company.id); }}>
                    <Trash2 size={16} />
                  </button>
                  <button className="bg-blue-600 text-white p-1 rounded" onClick={(e) => { e.stopPropagation(); handlePermission(company.id); }}>
                    <Lock size={16} />
                  </button>
                </td>
              </tr>

              {expandedCompanyId === company.id && (
                <tr>
                  <td colSpan={8} className="bg-gray-50 p-4">
                    <h3 className="font-semibold mb-2 text-lg">Users in {company.company_name}</h3>
                    {companyUsers.length > 0 ? (
                      <table className="min-w-full bg-white rounded shadow-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Mobile</th>
                            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Parent Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companyUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200">
                              <td className="px-3 py-2 text-sm">{user.id}</td>
                              <td className="px-3 py-2 text-sm text-blue-600 font-semibold">{user.name}</td>
                              <td className="px-3 py-2 text-sm">{user.email}</td>
                              <td className="px-3 py-2 text-sm">{user.mobile}</td>
                              <td className="px-3 py-2 text-sm text-green-600 font-medium">{user.parent_name || "No Parent"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No users found for this company.</p>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {/* ====== ADD COMPANY MODAL ====== */}
          {isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-auto max-h-[90vh]">
      <h2 className="text-xl font-bold mb-4">Add New Company</h2>
      <form onSubmit={handleAddSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Primary Contact Name"
          value={addForm.name}
          onChange={handleAddChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={addForm.email}
          onChange={handleAddChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={addForm.password}
          onChange={handleAddChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="mobile"
          placeholder="Mobile"
          value={addForm.mobile}
          onChange={handleAddChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="company_name"
          placeholder="Company Name"
          value={addForm.company_name}
          onChange={handleAddChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input name="licence_number" placeholder="Licence Number" value={addForm.licence_number} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="certification" placeholder="Certification" value={addForm.certification} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="pan_number" placeholder="PAN Number" value={addForm.pan_number} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="adhar_number" placeholder="Aadhar Number" value={addForm.adhar_number} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="bank_account_name" placeholder="Bank Account Name" value={addForm.bank_account_name} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="bank_account_no" placeholder="Bank Account Number" value={addForm.bank_account_no} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="ifsc_code" placeholder="IFSC Code" value={addForm.ifsc_code} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="gstin" placeholder="GSTIN" value={addForm.gstin} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="services" placeholder="Service Type" value={addForm.services} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="address" placeholder="Address" value={addForm.address} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />
        <input name="pincode" placeholder="Pincode" value={addForm.pincode} onChange={handleAddChange} className="w-full border rounded px-3 py-2" />

        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gradient-primary text-white rounded">Create Company</button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* ====== EDIT MODAL (UNCHANGED) ====== */}
      {isEditModalOpen && editCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Company</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Company Name</label>
                <input type="text" name="company_name" value={editCompany.company_name} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Licence Number</label>
                <input type="text" name="licence_number" value={editCompany.licence_number} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Certification</label>
                <input type="text" name="certification" value={editCompany.certification} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">PAN Number</label>
                <input type="text" name="pan_number" value={editCompany.pan_number} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Aadhar Number</label>
                <input type="text" name="adhar_number" value={editCompany.adhar_number} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Service Type</label>
                <input type="text" name="services" value={editCompany.services} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded border border-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-gradient-primary text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPermissionModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <h2 className="text-xl font-bold mb-4">Assign Permissions</h2>

      {/* <div className="grid grid-cols-2 gap-3">
        {ALL_PERMISSIONS.map((perm) => (
          <label key={perm} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(perm)}
              onChange={() =>
                setSelectedPermissions((prev) =>
                  prev.includes(perm)
                    ? prev.filter((p) => p !== perm)
                    : [...prev, perm]
                )
              }
            />
            {perm.replace("_", " ")}
          </label>
        ))}
      </div> */}

      {/* <div className="grid grid-cols-2 gap-3">
      {ALL_PERMISSIONS.map((perm) => (
        <label key={perm.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedPermissions.includes(perm.name)}
            onChange={() =>
              setSelectedPermissions((prev) =>
                prev.includes(perm.name)
                  ? prev.filter((p) => p !== perm.name)
                  : [...prev, perm.name]
              )
            }
          />
          {perm.name}
        </label>
      ))}
    </div> */}

    <div className="grid grid-cols-2 gap-3">
  {ALL_PERMISSIONS.map((perm) => (
    <label key={perm.id} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={selectedPermissions.includes(perm.id)}
        onChange={() =>
          setSelectedPermissions((prev) =>
            prev.includes(perm.id)
              ? prev.filter((id) => id !== perm.id)
              : [...prev, perm.id]
          )
        }
      />
      {perm.name}
    </label>
  ))}
</div>



      <div className="flex justify-end gap-3 mt-6">
        <Button
        onClick={async () => {
    try {
      const permissionsPayload = selectedPermissions.map((id) => {
        const perm = ALL_PERMISSIONS.find(p => p.id === id)!;

        return {
          id: perm.id,
          permission: perm.name,
          category: perm.category,
        };
      });

      await fetch(
        "https://collectkart.docboyz.in/api/assign-company-permissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: permissionCompanyId!,
            permissions: permissionsPayload,
          }),
        }
      );

      alert("Permissions saved");
      setIsPermissionModalOpen(false);
    } catch {
      alert("Save failed");
    }
  }}
>
  Save
</Button>


        <Button
          variant="secondary"
          onClick={() => setIsPermissionModalOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CompanyMaster;
