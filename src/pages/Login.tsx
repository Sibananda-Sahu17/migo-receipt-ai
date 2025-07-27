import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Scan } from "lucide-react"
import { useToast } from "@/components/ui/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast();
  const { login, signup, googleLogin } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(formData.email, formData.fullName, formData.password);
        toast({ title: "Sign up successful!"});
        setIsSignUp(false);

        await login(formData.email, formData.password);
        navigate("/home");
      } else {
        await login(formData.email, formData.password);
        toast({ title: "Login successful!" });
        navigate("/home");
      }
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err?.response?.data?.message || err.message || "An error occurred."
      });
    } finally {
      setLoading(false);
    }
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // tokenResponse contains access_token
        await googleLogin(tokenResponse.access_token);
        toast({ title: "Google login successful!" });
        navigate("/home");
      } catch (err: any) {
        toast({
          title: "Google login failed",
          description: err?.response?.data?.message || err.message || "An error occurred."
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      toast({ title: "Google login failed", description: error?.error || "An error occurred." });
    },
    flow: "implicit", // or remove for default, or use "auth-code" if backend expects code
  });

  const handleGoogleLogin = async () => {
    googleLoginHandler();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scan className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Sign Up" : "Sign In"} to Migo AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sign In Form */}
          {!isSignUp && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Sign In</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
            </div>
          )}

          {/* Sign Up Form */}
          {isSignUp && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Sign Up</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Sign Up
                </Button>
              </form>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login