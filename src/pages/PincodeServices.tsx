import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AppFooter } from "@/components/dashboard/AppFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import axios from "axios";

interface PincodeData {
  id: number;
  Pincode: number | null;
  City: string;
  District: string;
  State: string;
  PostOffice: string | null;
  Zone: string | null;
}

interface ServiceData {
  id: number;
  category: string;
  name: string;
  description: string;
  price: string;
  discount: number;
  image: string;
  city: string | null;
  state: string | null;
  subcategory: string | null;
  pincode: string | null;
  package_percentage: number;
  created_at: string | null;
  updated_at: string | null;
}

interface PincodeServiceRecord {
  id: number;
  state: string;
  city: string;
  pincode: string;
  service_id: number;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service: {
    id: number;
    category: string;
    name: string;
    description: string;
  };
}

const PincodeServices = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Table data and functionality
  const [pincodeServices, setPincodeServices] = useState<PincodeServiceRecord[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PincodeServiceRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  
  // Search and pagination for table
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form states - now arrays for multiselect
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [price, setPrice] = useState("");

  // Filtered data
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredPincodes, setFilteredPincodes] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);

  // Fetch pincode services data
  const fetchPincodeServices = async () => {
    setTableLoading(true);
    try {
      // Use the detailed endpoint with raw query for proper service_prices join
      const response = await axios.get("https://collectkart.docboyz.in/api/pincode-services-details");
      if (response.data.status === "success") {
        setPincodeServices(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pincode services:", error);
    } finally {
      setTableLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPincodeServices();
  }, []);

  // Filter and paginate table data
  const filteredPincodeServices = pincodeServices.filter(service =>
    service.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.pincode.includes(searchTerm) ||
    service.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPincodeServices.length / itemsPerPage);
  const paginatedServices = filteredPincodeServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Edit functionality
  const handleEdit = (record: PincodeServiceRecord) => {
    setEditingRecord(record);
    setEditPrice(record.price);
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async () => {
    if (!editingRecord || !editPrice) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const response = await axios.put(
        `https://collectkart.docboyz.in/api/pincode-services/${editingRecord.id}`,
        { price: editPrice }
      );
      
      if (response.data.status === "success") {
        alert("Service updated successfully!");
        setIsEditModalOpen(false);
        setEditingRecord(null);
        setEditPrice("");
        fetchPincodeServices(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    }
  };

  // Delete functionality
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://collectkart.docboyz.in/api/pincode-services/${id}`
      );
      
      if (response.data.status === "success") {
        alert("Service deleted successfully!");
        fetchPincodeServices(); // Refresh data
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };
  const handleAddServicePincode = async () => {
    setIsModalOpen(true);
    setLoading(true);
    
    try {
      // Fetch pincode data
      const pincodeResponse = await axios.get("https://collectkart.docboyz.in/api/allpincodedata");
      if (pincodeResponse.data.status === "success") {
        setPincodeData(pincodeResponse.data.agent);
      }

      // Fetch service data
      const serviceResponse = await axios.get("https://collectkart.docboyz.in/api/getallservicedata");
      if (serviceResponse.data.status === "success") {
        setServiceData(serviceResponse.data.services);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(serviceResponse.data.services.map((service: ServiceData) => service.category))].filter(Boolean) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Get unique states
  const states = [...new Set(pincodeData.map(item => item.State).filter(Boolean))];

  // Filter cities based on selected states
  useEffect(() => {
    if (selectedStates.length > 0) {
      const cities = pincodeData
        .filter(item => selectedStates.includes(item.State))
        .map(item => item.City)
        .filter(Boolean);
      setFilteredCities([...new Set(cities)]);
    } else {
      setFilteredCities([]);
    }
    setSelectedCities([]);
    setSelectedPincodes([]);
  }, [selectedStates, pincodeData]);

  // Filter pincodes based on selected cities
  useEffect(() => {
    if (selectedCities.length > 0) {
      const pincodes = pincodeData
        .filter(item => 
          selectedStates.includes(item.State) && 
          selectedCities.includes(item.City)
        )
        .map(item => item.Pincode)
        .filter(pincode => pincode !== null && pincode !== 0);
      setFilteredPincodes([...new Set(pincodes)]);
    } else {
      setFilteredPincodes([]);
    }
    setSelectedPincodes([]);
  }, [selectedCities, selectedStates, pincodeData]);

  // Filter services based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const services = serviceData.filter(service => 
        selectedCategories.includes(service.category)
      );
      setFilteredServices(services);
    } else {
      setFilteredServices([]);
    }
    setSelectedServices([]);
  }, [selectedCategories, serviceData]);

  const handleSubmit = async () => {
    if (selectedStates.length === 0 || selectedCities.length === 0 || 
        selectedPincodes.length === 0 || selectedServices.length === 0 || !price) {
      alert("Please fill all fields");
      return;
    }

    // Create multiple entries for each combination
    const promises = [];
    
    for (const state of selectedStates) {
      for (const city of selectedCities) {
        for (const pincode of selectedPincodes) {
          for (const serviceId of selectedServices) {
            const payload = {
              state: state,
              city: city,
              pincode: pincode,
              service_id: serviceId,
              price: price
            };
            promises.push(
              axios.post("https://collectkart.docboyz.in/api/add-pincode-service", payload)
            );
          }
        }
      }
    }

    try {
      await Promise.all(promises);
      alert(`Successfully added ${promises.length} service entries!`);
      setIsModalOpen(false);
      // Reset form
      setSelectedStates([]);
      setSelectedCities([]);
      setSelectedPincodes([]);
      setSelectedCategories([]);
      setSelectedServices([]);
      setPrice("");
      // Refresh table data
      fetchPincodeServices();
    } catch (error) {
      console.error("Error adding services:", error);
      alert("Failed to add some services");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pincode Wise Services</h1>
            <p className="text-muted-foreground">
              Manage services by pincode locations
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </Button>
            <Button onClick={handleAddServicePincode} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service Pincode
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Services
            </CardTitle>
            <CardDescription>
              Find services by location and category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Search by state..." />
              <Input placeholder="Search by city..." />
              <Input placeholder="Search by pincode..." />
              <Input placeholder="Search by service..." />
            </div>
          </CardContent>
        </Card>

        {/* Services Table/Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pincode Services ({filteredPincodeServices.length})
            </CardTitle>
            <CardDescription>
              List of services available by pincode
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search for table */}
            <div className="mb-4">
              <Input
                placeholder="Search by state, city, pincode, service name, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-md"
              />
            </div>

            {tableLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading services...</p>
              </div>
            ) : paginatedServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pincode services found.</p>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search terms." : "Click 'Add Service Pincode' to get started."}
                </p>
              </div>
            ) : (
              <>
                {/* Services Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium">State</th>
                        <th className="py-3 px-4 font-medium">City</th>
                        <th className="py-3 px-4 font-medium">Pincode</th>
                        <th className="py-3 px-4 font-medium">Category</th>
                        <th className="py-3 px-4 font-medium">Service</th>
                        <th className="py-3 px-4 font-medium">Description</th>
                        <th className="py-3 px-4 font-medium">Price</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedServices.map((service) => (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{service.state}</td>
                          <td className="py-3 px-4">{service.city}</td>
                          <td className="py-3 px-4">{service.pincode}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {service.service.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">{service.service.name}</td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="truncate" title={service.service.description}>
                              {service.service.description}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            ₹{parseFloat(service.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              service.is_active 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {service.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(service)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(service.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredPincodeServices.length)} of{" "}
                    {filteredPincodeServices.length} services
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>

                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(index + 1)}
                        className="w-8"
                      >
                        {index + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Service Pincode Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Service Pincode</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* State MultiSelect */}
              <div>
                <Label htmlFor="states">States</Label>
                <MultiSelect
                  options={states.map(state => ({ value: state, label: state }))}
                  value={selectedStates}
                  onChange={setSelectedStates}
                  placeholder="Select states..."
                  className="mt-1"
                />
              </div>

              {/* City MultiSelect */}
              <div>
                <Label htmlFor="cities">Cities</Label>
                <MultiSelect
                  options={filteredCities.map(city => ({ value: city, label: city }))}
                  value={selectedCities}
                  onChange={setSelectedCities}
                  placeholder="Select cities..."
                  disabled={selectedStates.length === 0}
                  className="mt-1"
                />
              </div>

              {/* Pincode MultiSelect */}
              <div>
                <Label htmlFor="pincodes">Pincodes</Label>
                <MultiSelect
                  options={filteredPincodes.map(pincode => ({ 
                    value: pincode.toString(), 
                    label: pincode.toString() 
                  }))}
                  value={selectedPincodes}
                  onChange={setSelectedPincodes}
                  placeholder="Select pincodes..."
                  disabled={selectedCities.length === 0}
                  className="mt-1"
                />
              </div>

              {/* Category MultiSelect */}
              <div>
                <Label htmlFor="categories">Categories</Label>
                <MultiSelect
                  options={categories.map(category => ({ value: category, label: category }))}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                  className="mt-1"
                />
              </div>

              {/* Service MultiSelect */}
              <div>
                <Label htmlFor="services">Services</Label>
                <MultiSelect
                  options={filteredServices.map(service => ({ 
                    value: service.id.toString(), 
                    label: service.name 
                  }))}
                  value={selectedServices}
                  onChange={setSelectedServices}
                  placeholder="Select services..."
                  disabled={selectedCategories.length === 0}
                  className="mt-1"
                />
              </div>

              {/* Price Input */}
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Summary */}
              {selectedStates.length > 0 && selectedCities.length > 0 && 
               selectedPincodes.length > 0 && selectedServices.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border">
                  <p className="text-sm font-medium text-blue-800 mb-1">Summary:</p>
                  <p className="text-xs text-blue-600">
                    This will create {selectedStates.length * selectedCities.length * 
                    selectedPincodes.length * selectedServices.length} service entries
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    States: {selectedStates.length} | Cities: {selectedCities.length} | 
                    Pincodes: {selectedPincodes.length} | Services: {selectedServices.length}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Price</DialogTitle>
          </DialogHeader>
          
          {editingRecord && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Service Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {editingRecord.state}, {editingRecord.city} - {editingRecord.pincode}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Service:</strong> {editingRecord.service.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {editingRecord.service.category}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {editingRecord.service.description}
                </p>
              </div>

              <div>
                <Label htmlFor="editPrice">New Price</Label>
                <Input
                  id="editPrice"
                  type="number"
                  placeholder="Enter new price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateService}>
              Update Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AppFooter />
    </div>
  );
};

export default PincodeServices;