import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Stethoscope, 
  Scissors, 
  Shield, 
  Building2, 
  Pill, 
  Plus,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";

export const ServiceManagement = () => {
  const services = [
    {
      id: 1,
      name: "Pet Insurance",
      icon: Shield,
      description: "Comprehensive insurance coverage for pets",
      activeClients: 1834,
      monthlyGrowth: 15,
      revenue: "₹2,45,890",
      status: "active",
      color: "primary"
    },
    {
      id: 2,
      name: "Veterinary Services",
      icon: Stethoscope,
      description: "Professional veterinary care and consultation",
      activeClients: 567,
      monthlyGrowth: 8,
      revenue: "₹1,23,450",
      status: "active",
      color: "success"
    },
    {
      id: 3,
      name: "Pet Grooming",
      icon: Scissors,
      description: "Professional grooming and styling services",
      activeClients: 423,
      monthlyGrowth: 23,
      revenue: "₹87,650",
      status: "active",
      color: "accent"
    },
    {
      id: 4,
      name: "Pet Hospital",
      icon: Building2,
      description: "24/7 emergency and critical care",
      activeClients: 234,
      monthlyGrowth: 12,
      revenue: "₹98,760",
      status: "active",
      color: "warning"
    },
    {
      id: 5,
      name: "Medical Shops",
      icon: Pill,
      description: "Pet medications and health products",
      activeClients: 156,
      monthlyGrowth: 5,
      revenue: "₹45,230",
      status: "pending",
      color: "secondary"
    },
    {
      id: 6,
      name: "Pet Hostel",
      icon: Heart,
      description: "Boarding and daycare services",
      activeClients: 89,
      monthlyGrowth: -2,
      revenue: "₹32,450",
      status: "review",
      color: "destructive"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "review":
        return <Badge variant="destructive">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "accent":
        return "text-accent";
      case "destructive":
        return "text-destructive";
      case "secondary":
        return "text-secondary";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-muted-foreground">
            Manage all Insurance services across your platform
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{services.reduce((sum, s) => sum + s.activeClients, 0).toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹6,33,430</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                <p className="text-2xl font-bold">+10.2%</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-gradient-card hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-primary`}>
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>
              <CardDescription className="text-sm">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-xl font-bold">{service.activeClients.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">{service.revenue}</p>
                </div>
              </div>

              {/* Growth */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Monthly Growth</span>
                  <span className={service.monthlyGrowth >= 0 ? "text-success" : "text-destructive"}>
                    {service.monthlyGrowth >= 0 ? "+" : ""}{service.monthlyGrowth}%
                  </span>
                </div>
                <Progress 
                  value={Math.abs(service.monthlyGrowth)} 
                  className="h-2" 
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};