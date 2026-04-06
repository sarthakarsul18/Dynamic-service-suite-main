import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  MoreHorizontal, 
  UserCheck,
  Clock
} from "lucide-react";

export const AgentManagement = () => {
  const agents = [
    {
      id: 1,
      name: "John Doe",
      email: "john@petcare.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      pincode: "400001",
      status: "active",
      services: ["Insurance", "Grooming"],
      callsToday: 12,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@petcare.com",
      phone: "+91 98765 43211",
      location: "Delhi, Delhi",
      pincode: "110001",
      status: "busy",
      services: ["Veterinary", "Hospital"],
      callsToday: 8,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Raj Patel",
      email: "raj@petcare.com",
      phone: "+91 98765 43212",
      location: "Pune, Maharashtra",
      pincode: "411001",
      status: "offline",
      services: ["Insurance", "Medical"],
      callsToday: 0,
      avatar: "/api/placeholder/40/40"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "busy":
        return <Badge className="bg-warning text-warning-foreground">Busy</Badge>;
      case "offline":
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Agent Management</h2>
          <p className="text-muted-foreground">
            Manage agents across different locations and services
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Agent
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search by name or email..." className="w-full" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="veterinary">Veterinary</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Agents ({agents.length})
          </CardTitle>
          <CardDescription>
            Location-based agent distribution and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Today's Calls</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={agent.avatar} />
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">ID: #{agent.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3" />
                        {agent.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        {agent.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{agent.location}</p>
                        <p className="text-xs text-muted-foreground">PIN: {agent.pincode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(agent.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{agent.callsToday}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};