import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { X, Phone, MessageCircle, Trash2, Send, MessageSquareText} from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";

interface VehicleData {
  id: number;
  vehicle_no: string;
  kcy_status: string;
  pdf: string;
  owner: string;
  owner_fathers_name: string;
  present_address: string;
  permanent_address: string;
  rc_status: string;
  authority: string;
  registration_date: string;
  expiry_date: string;
  RTO_code: string;
  fuel_type: string;
  vehicle_mmv: string;
  model_name: string;
  color: string;
  chassis: string;
  engine: string;
}

const VehicleEnquiryTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<VehicleData[]>([]);
  const [filteredData, setFilteredData] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    axios
      .post("https://collectkart.docboyz.in/api/get_vehicledata", {
        id: parsedUser?.id ?? null,
        user_id: parsedUser?.user_id ?? parsedUser?.id ?? null,
      })
      .then((res) => {
        if (res.data?.status === "200") {
          setData(res.data.data);
          setFilteredData(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = () => {
    const filtered = data.filter((vehicle) => {
      const regDate = new Date(vehicle.registration_date);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return regDate >= from && regDate <= to;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleVehicleClick = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCall = async (phone: string) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const agentNumber = parsedUser?.mobile || parsedUser?.phone || "";
    if (!agentNumber) { alert("Your mobile number is not set in profile."); return; }
    try {
      await axios.post("https://insuranceapp.tommyandfurry.com/api/click-to-call", {
        async: 1,
        agent_number: agentNumber,
        destination_number: phone,
        caller_id: "7965801284",
      });
      alert(`✅ Call initiated to ${phone}`);
    } catch (e) {
      console.error(e);
      alert("❌ Failed to initiate call.");
    }
  };

  const handleWhatsapp = (vehicle: VehicleData) => {
    const link = "https://insurance.tommyandfurry.com/tommyandfurryuat/#/";
    // Open WhatsApp with the link pre-filled; user selects the contact
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSendMessage = () => {
    console.log("Message sent:", messageText);
    setIsMessageOpen(false);
    setMessageText("");
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
            🚗 Vehicle Enquiry
          </h1>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
          
        </div>

        {/* Card */}
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Vehicle Records</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end bg-blue-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm text-gray-700 font-medium">From Date</label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium">To Date</label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={handleFilter} className="bg-[#3c83f6] hover:bg-blue-700 text-white">
                Apply Filter
              </Button>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead>ID</TableHead>
                        <TableHead>Vehicle No</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Father's Name</TableHead>
                        <TableHead>RC Status</TableHead>
                        <TableHead>Authority</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRows.map((vehicle) => (
                        <TableRow key={vehicle.id} className="hover:bg-blue-50 transition cursor-pointer">
                          <TableCell>{vehicle.id}</TableCell>
                          <TableCell
                            className="font-medium underline"
                            style={{ color: "#3c83f6" }}
                            onClick={() => handleVehicleClick(vehicle)}
                          >
                            {vehicle.vehicle_no}
                          </TableCell>
                          <TableCell>{vehicle.owner}</TableCell>
                          <TableCell>{vehicle.owner_fathers_name}</TableCell>
                          <TableCell>{vehicle.rc_status}</TableCell>
                          <TableCell>{vehicle.authority}</TableCell>
                          <TableCell>{vehicle.model_name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Trash2 className="text-red-600 hover:text-red-800 w-4 h-4 cursor-pointer" />
                              <Phone className="text-green-600 hover:text-green-800 w-4 h-4 cursor-pointer" onClick={() => handleCall("9999999999")} />
                              <MessageCircle className="text-purple-600 hover:text-purple-800 w-4 h-4 cursor-pointer" onClick={() => setIsMessageOpen(true)} />
                                <AiOutlineWhatsApp
                                  className="text-[#25D366] hover:text-green-600 w-5 h-5 cursor-pointer"
                                  onClick={() => handleWhatsapp(vehicle)}
                                />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {[5, 10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <p className="text-sm text-gray-500">Page {currentPage} of {totalPages} · {filteredData.length} total</p>
                  <div className="flex gap-2">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} variant="outline">Previous</Button>
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} variant="outline">Next</Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Vehicle Detail Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Vehicle Details</h2>
            {selectedVehicle && (
              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <div><strong>Vehicle No:</strong> {selectedVehicle.vehicle_no}</div>
                <div><strong>Owner:</strong> {selectedVehicle.owner}</div>
                <div><strong>Father's Name:</strong> {selectedVehicle.owner_fathers_name}</div>
                <div><strong>RC Status:</strong> {selectedVehicle.rc_status}</div>
                <div><strong>Authority:</strong> {selectedVehicle.authority}</div>
                <div><strong>Registration Date:</strong> {selectedVehicle.registration_date}</div>
                <div><strong>Expiry Date:</strong> {selectedVehicle.expiry_date}</div>
                <div><strong>Present Address:</strong> {selectedVehicle.present_address}</div>
                <div><strong>Permanent Address:</strong> {selectedVehicle.permanent_address}</div>
                <div><strong>RTO Code:</strong> {selectedVehicle.RTO_code}</div>
                <div><strong>Vehicle MMV:</strong> {selectedVehicle.vehicle_mmv}</div>
                <div><strong>Model Name:</strong> {selectedVehicle.model_name}</div>
                <div><strong>Chassis:</strong> {selectedVehicle.chassis}</div>
                <div><strong>Engine:</strong> {selectedVehicle.engine}</div>
                <div><strong>Fuel Type:</strong> {selectedVehicle.fuel_type}</div>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageOpen} onClose={() => setIsMessageOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsMessageOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-purple-600">Send Message</h2>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Button onClick={handleSendMessage} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <Send className="w-4 h-4" /> Send
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default VehicleEnquiryTable;
