import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Send, 
  Bot,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  PhoneCall
} from "lucide-react";

export const CommunicationCenter = () => {
  const recentCommunications = [
    {
      id: 1,
      type: "call",
      customer: "Priya Sharma",
      agent: "John Doe",
      subject: "Pet Insurance Claim",
      time: "2 mins ago",
      status: "completed",
      duration: "8m 45s"
    },
    {
      id: 2,
      type: "whatsapp",
      customer: "Rahul Verma", 
      agent: "AI Assistant",
      subject: "Grooming Appointment",
      time: "5 mins ago",
      status: "active",
      duration: "Ongoing"
    },
    {
      id: 3,
      type: "email",
      customer: "Neha Patel",
      agent: "Sarah Smith",
      subject: "Policy Renewal",
      time: "12 mins ago",
      status: "pending",
      duration: "N/A"
    },
    {
      id: 4,
      type: "sms",
      customer: "Amit Kumar",
      agent: "System",
      subject: "Appointment Reminder",
      time: "18 mins ago",
      status: "delivered",
      duration: "N/A"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="w-4 h-4 text-primary" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-success" />;
      case "email":
        return <Mail className="w-4 h-4 text-warning" />;
      case "sms":
        return <Send className="w-4 h-4 text-accent" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "delivered":
        return <Badge variant="outline">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-muted-foreground">
            Manage all customer communications and AI-powered responses
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Calls</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Phone className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">WhatsApp Chats</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <MessageSquare className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Emails</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Mail className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Responses</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Bot className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communication Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>
              Send messages across multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="broadcast" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>
              
              <TabsContent value="broadcast" className="space-y-4">
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="active">Active Policy Holders</SelectItem>
                      <SelectItem value="pending">Pending Renewals</SelectItem>
                      <SelectItem value="location">By Location</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Message subject" />
                  <Textarea 
                    placeholder="Type your broadcast message here..." 
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center gap-2">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Send className="w-4 h-4 mr-2" />
                      Send Broadcast
                    </Button>
                    <Button variant="outline">
                      <Bot className="w-4 h-4 mr-2" />
                      AI Enhance
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <div className="space-y-4">
                  <Input placeholder="Customer phone number" />
                  <Textarea 
                    placeholder="WhatsApp message..." 
                    className="min-h-[100px]"
                  />
                  <Button className="bg-gradient-secondary hover:opacity-90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send WhatsApp
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-4">
                  <Input placeholder="To: customer@email.com" />
                  <Input placeholder="Subject" />
                  <Textarea 
                    placeholder="Email content..." 
                    className="min-h-[100px]"
                  />
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="sms" className="space-y-4">
                <div className="space-y-4">
                  <Input placeholder="Phone number" />
                  <Textarea 
                    placeholder="SMS message (160 characters max)..." 
                    className="min-h-[80px]"
                  />
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              AI-powered response suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Responses</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  "Thank you for contacting PetCare..."
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  "Your policy renewal is due..."
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  "Appointment confirmed for..."
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">AI Settings</h4>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Auto-respond enabled
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Response delay: 30s
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
          <CardDescription>
            Latest customer interactions across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCommunications.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card">
                <div className="flex items-center gap-4">
                  {getTypeIcon(comm.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{comm.customer}</p>
                      <span className="text-muted-foreground">→</span>
                      <p className="text-sm text-muted-foreground">{comm.agent}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{comm.time}</span>
                      <span>Duration: {comm.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(comm.status)}
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};