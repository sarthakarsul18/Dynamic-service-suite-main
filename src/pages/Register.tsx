import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const SERVICE_TYPES = ["Pet Service", "Insurance"];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
    pincode: "",
    state: "",
    bank_account_name: "",
    bank_account_no: "",
    ifsc_code: "",
    gstin: "",
    company_name: "",
    licence_number: "",
    certification: "",
    pan_number: "",
    adhar_number: "",
    service_type: ""
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
          toast({ title: "Please complete all fields", variant: "destructive" });
          return;
        }

        // ✅ Password validation regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(form.password)) {
          toast({
            title: "Password must be at least 8 characters and include uppercase, lowercase, and number",
            variant: "destructive"
          });
          return;
        }

        if (form.password !== form.confirmPassword) {
          toast({ title: "Passwords do not match", variant: "destructive" });
          return;
        }

        setStep(2);
    }

    if (step === 2) {
      if (!form.mobile || !form.address || !form.pincode || !form.state) {
        toast({ title: "Please fill required details", variant: "destructive" });
        return;
      }
      setStep(3);
    }

    if (step === 3) {
      if (!form.bank_account_name || !form.bank_account_no || !form.ifsc_code || !form.gstin) {
        toast({ title: "Please complete bank details", variant: "destructive" });
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.licence_number || !form.certification || !form.pan_number || !form.adhar_number || !form.service_type) {
      toast({ title: "Please complete company details", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://collectkart.docboyz.in/api/tommyregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Registration Successful" });
        navigate("/");
      } else {
        toast({
          title: data.message || "Registration failed",
          variant: "destructive"
        });
      }
    } catch {
      toast({ title: "Server Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#cfffc7ff" }}>
      <Card className="w-full max-w-md relative backdrop-blur-sm border-0 shadow-glow bg-gradient-card">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription>Join Insurance Services Platform</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={step === 4 ? handleRegister : handleNext}
            className="space-y-4"
          >

            {/* STEP 1: Personal */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input name="password" type="password" value={form.password} onChange={handleChange} />
                   <p className="text-xs text-gray-500">
                    Password must be 8+ characters with uppercase, lowercase, number & special character (e.g. Test@123)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </>
            )}

            {/* STEP 2: Contact */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input name="mobile" value={form.mobile} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input name="address" value={form.address} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input name="pincode" value={form.pincode} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select State</option>
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* STEP 3: Bank */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Bank Account Name</Label>
                  <Input name="bank_account_name" value={form.bank_account_name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Bank Account Number</Label>
                  <Input name="bank_account_no" value={form.bank_account_no} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input name="ifsc_code" value={form.ifsc_code} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN</Label>
                  <Input name="gstin" value={form.gstin} onChange={handleChange} />
                </div>
              </>
            )}

            {/* STEP 4: Company + Service Type */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input name="company_name" value={form.company_name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Licence Number</Label>
                  <Input name="licence_number" value={form.licence_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Certification</Label>
                  <Input name="certification" value={form.certification} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input name="pan_number" value={form.pan_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number</Label>
                  <Input name="adhar_number" value={form.adhar_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <select
                    name="service_type"
                    value={form.service_type}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Service Type</option>
                    {SERVICE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-between gap-4 pt-2">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={handleBack} className="w-1/2">
                  Back
                </Button>
              )}
              <Button type="submit" className="w-1/2 bg-gradient-primary">
                {step === 4 ? "Register" : "Next"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
