import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Users, Heart } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const tenants = [
    { id: "petcare-hq", name: "PetCare HQ", type: "Main Admin" },
    { id: "happy-paws", name: "Happy Paws Clinic", type: "Veterinary" },
    { id: "pet-grooming", name: "Elite Pet Grooming", type: "Grooming" },
    { id: "pet-insurance", name: "SafePet Insurance", type: "Insurance" },
    { id: "pet-hospital", name: "Central Pet Hospital", type: "Hospital" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("https://collectkart.docboyz.in/api/logindashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      const user = data.user;

      if (user.status == 1) {
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Login successful!",
          description: `Welcome ${user.name}`
        });

        navigate("/dashboard");
      } else {
        toast({
          title: "Account Inactive",
          description: "Your account is currently deactivated.",
          variant: "destructive"
        });

        navigate("/dashboardinactive");
      }
    } else {
      toast({
        title: "Login failed",
        description: data.message || "Invalid credentials",
        variant: "destructive"
      });
    }
  } catch (error) {
    toast({
      title: "Server Error",
      description: "Unable to connect to login API",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#cfffc7ff' }}>
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" /> */}

      <Card className="w-full max-w-md relative backdrop-blur-sm border-0 shadow-glow bg-gradient-card">
        <CardHeader className="space-y-4 text-center">
          {/* <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div> */}
          <div className="mx-auto w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden">
            <img
              src="/TommyAndFurry_logo_bg.png"
              alt="App Logo"
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Novacred Insurance
            </CardTitle>
            {/* <CardDescription className="text-muted-foreground">
              Multi-tenant management platform
            </CardDescription> */}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Uncomment if you want tenant dropdown */}
            {/* <div className="space-y-2">
              <Label htmlFor="tenant" className="text-sm font-medium">
                Select Tenant
              </Label>
              <Select value={tenant} onValueChange={setTenant}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your organization" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.type}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@petservices.com"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                    Password must be 8+ characters with uppercase, lowercase, number & special character (e.g. Test@123)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-primary hover:underline mt-2"
              onClick={() => navigate("/register")}
            >
              New user? Register here
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Use registered email & password to sign in
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature highlights */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8 text-sm text-primary-foreground/80">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Multi-tenant
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Role-based
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Pet Services
        </div>
      </div>
    </div>
  );
};

export default Login;
