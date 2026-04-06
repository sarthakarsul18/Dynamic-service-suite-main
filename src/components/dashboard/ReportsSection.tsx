import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Target,
  AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

export const ReportsSection = () => {
  const reports = [
    { id: 1, name: "Agent Performance Report", description: "Detailed analysis of agent productivity and customer satisfaction", type: "Performance", lastGenerated: "2024-01-15", status: "ready", downloads: 23 },
    { id: 6, name: "Enquiry Report", description: "Comprehensive analysis of customer enquiries, conversion rate and follow-up status", type: "Operations", lastGenerated: "2024-01-16", status: "ready", downloads: 18 },
    { id: 2, name: "Service Revenue Analysis", description: "Monthly revenue breakdown by service category", type: "Financial", lastGenerated: "2024-01-14", status: "ready", downloads: 45 },
    { id: 3, name: "Customer TAT Report", description: "Turnaround time analysis for customer service requests", type: "Operations", lastGenerated: "2024-01-13", status: "generating", downloads: 12 },
    { id: 4, name: "Multi-tenant Usage Statistics", description: "Platform usage across different tenant organizations", type: "Analytics", lastGenerated: "2024-01-12", status: "ready", downloads: 67 },
    { id: 5, name: "Payment & Invoice Summary", description: "Comprehensive payment tracking and invoice generation report", type: "Financial", lastGenerated: "2024-01-11", status: "scheduled", downloads: 34 }
  ];

  const kpis = [
    { name: "Average TAT", value: "2.4 hours", change: "-12%", trend: "down", icon: Clock, color: "success" },
    { name: "Customer Satisfaction", value: "4.7/5.0", change: "+5%", trend: "up", icon: Target, color: "primary" },
    { name: "Service Completion Rate", value: "94.2%", change: "+2%", trend: "up", icon: TrendingUp, color: "success" },
    { name: "Revenue Growth", value: "₹15.2L", change: "+18%", trend: "up", icon: DollarSign, color: "warning" }
  ];

  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
 const [enquiryFromDate, setEnquiryFromDate] = useState(today);
const [enquiryToDate, setEnquiryToDate] = useState(today);

const handleGenerateReport = async () => {
  try {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    // Call Backend API
    const response = await axios.post("https://collectkart.docboyz.in/api/report-by-date", {
      from_date: fromDate,
      to_date: toDate,
    });

    const reportData = response.data.data;

    if (!reportData || reportData.length === 0) {
      alert("No data found for selected dates");
      return;
    }

    const headers = [[
  "Name",
  "Mobile No",
  "Address",
  "District",
  "State",
  "Pincode",
  "Sender",
  "Services Offered",
  "Remark",
  "Created At",
  "Updated At"
]];


    // Map Data
    const rows = reportData.map((item: any) => [
      item.owner_name,
      item.mobile_no,
      item.address,
      item.district,
      item.state,
      item.pincode,
      item.sender_name, 
      item.services_offered_type,
      item.remark,
      item.created_at,
      item.updated_at
    ]);

    const sheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Date_Report");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    saveAs(blob, `Remark_Report_${fromDate}_to_${toDate}.xlsx`);

  } catch (error) {
    console.error("Report generation error:", error);
  }
};
const handleEnquiryReportDownload = async () => {
  try {
    if (!enquiryFromDate || !enquiryToDate) {
      alert("Please select From and To Date");
      return;
    }

    const response = await axios.post(
      "https://collectkart.docboyz.in/api/report-by-date",
      {
        from_date: enquiryFromDate,
        to_date: enquiryToDate,
      }
    );

    const reportData = response.data.data;

    if (!reportData || reportData.length === 0) {
      alert("No data found");
      return;
    }

    const headers = [[
      "Owner Name",
      "Mobile No",
      "Address",
      "District",
      "State",
      "Pincode",
      "Sender",
      "Services Offered",
      "Remark",
      "Created At",
      "Updated At"
    ]];

    const rows = reportData.map((item: any) => [
      item.owner_name,
      item.mobile_no,
      item.address,
      item.district,
      item.state,
      item.pincode,
      item.sender_name, 
      item.services_offered_type,
      item.remark,
      item.created_at,
      item.updated_at
    ]);

    const sheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Enquiry_Report");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    saveAs(blob, `Enquiry_Report_${enquiryFromDate}_to_${enquiryToDate}.xlsx`);
  } catch (error) {
    console.error(error);
  }
};

const handleAgentReportDownload  = async () => {
  try {
    if (!enquiryFromDate || !enquiryToDate) {
      alert("Please select From and To Date");
      return;
    }

    const response = await axios.post(
      "https://collectkart.docboyz.in/api/agentreport-by-date",
      {
        from_date: enquiryFromDate,
        to_date: enquiryToDate,
      }
    );

    const reportData = response.data.data;

    if (!reportData || reportData.length === 0) {
      alert("No data found");
      return;
    }

    const headers = [[
      "agent_name",
      "email",
      "phone",
      "city",
      "pincode",
      "remark",
      "sender",
      "date"
    ]];

    const rows = reportData.map((item: any) => [
      item.agent_name,
      item.email,
      item.phone,
      item.city,
      item.pincode,
      item.remark,
      item.sender, 
      item.created_at, 
    ]);

    const sheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Enquiry_Report");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    saveAs(blob, `POSP_Enquiry_Report_${enquiryFromDate}_to_${enquiryToDate}.xlsx`);
  } catch (error) {
    console.error(error);
  }
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-success text-success-foreground">Ready</Badge>;
      case "generating":
        return <Badge className="bg-warning text-warning-foreground">Generating</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Performance": return "text-primary";
      case "Financial": return "text-success";
      case "Operations": return "text-warning";
      case "Analytics": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive reporting for all business metrics and KPIs</p>
        </div>
        <div className="flex gap-2 items-center">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded p-2" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded p-2" />
          <Button onClick={handleGenerateReport} className="bg-gradient-primary hover:opacity-90">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`w-3 h-3 ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                    <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>{kpi.change}</span>
                  </div>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color === 'success' ? 'text-success' : kpi.color === 'warning' ? 'text-warning' : 'text-accent'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Available Reports</CardTitle>
            <CardDescription>Pre-configured reports for different business needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className={`w-4 h-4 ${getTypeColor(report.type)}`} />
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Last generated: {report.lastGenerated}</span>
                      <span>Downloads: {report.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  {report.name === "Enquiry Report" ? (
  <div className="flex items-center gap-2">
    <input
      type="date"
      value={enquiryFromDate}
      onChange={(e) => setEnquiryFromDate(e.target.value)}
      className="border rounded p-1 text-xs"
    />
    <input
      type="date"
      value={enquiryToDate}
      onChange={(e) => setEnquiryToDate(e.target.value)}
      className="border rounded p-1 text-xs"
    />
    <Button
      variant="outline"
      size="sm"
      onClick={handleEnquiryReportDownload}
    >
      <Download className="w-3 h-3 mr-1" />
      Download
    </Button>
  </div>
) : report.name === "Agent Performance Report" ? (
  <div className="flex items-center gap-2">
    <input
      type="date"
      value={enquiryFromDate}
      onChange={(e) => setEnquiryFromDate(e.target.value)}
      className="border rounded p-1 text-xs"
    />
    <input
      type="date"
      value={enquiryToDate}
      onChange={(e) => setEnquiryToDate(e.target.value)}
      className="border rounded p-1 text-xs"
    />
    <Button
      variant="outline"
      size="sm"
      onClick={handleAgentReportDownload }
    >
      <Download className="w-3 h-3 mr-1" />
      Download
    </Button>
  </div>
) : (
  <Button variant="outline" size="sm" disabled>
    <Download className="w-3 h-3 mr-1" />
    Download
  </Button>
)}

                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common reporting tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="sm"><Calendar className="w-4 h-4 mr-2" /> Schedule Weekly Report</Button>
            <Button variant="outline" className="w-full justify-start" size="sm"><Users className="w-4 h-4 mr-2" /> Agent Performance Summary</Button>
            <Button variant="outline" className="w-full justify-start" size="sm"><DollarSign className="w-4 h-4 mr-2" /> Revenue Dashboard</Button>
            <Button variant="outline" className="w-full justify-start" size="sm"><Clock className="w-4 h-4 mr-2" /> TAT Analysis</Button>
            <Button variant="outline" className="w-full justify-start" size="sm"><Target className="w-4 h-4 mr-2" /> Service Quality Report</Button>
            <Button variant="outline" className="w-full justify-start" size="sm"><AlertCircle className="w-4 h-4 mr-2" /> Issue Tracking Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
