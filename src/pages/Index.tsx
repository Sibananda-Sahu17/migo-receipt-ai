import { ArrowRight, Scan, Brain, Receipt, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import heroImage from "@/assets/hero-image.jpg"

const Index = () => {
  const features = [
    {
      icon: Scan,
      title: "Smart Scanning",
      description: "Upload receipts via photo, file, video, or live stream",
      color: "bg-primary",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Extract structured data and get spending insights",
      color: "bg-accent",
    },
    {
      icon: Receipt,
      title: "Analytics",
      description: "Track patterns, split bills, and manage expenses",
      color: "bg-success",
    },
    {
      icon: Users,
      title: "Google Wallet",
      description: "Save receipts directly to your wallet",
      color: "bg-warning",
    },
  ]

  const steps = [
    { icon: Scan, title: "Upload", href: "/upload" },
    { icon: Brain, title: "AI Analytics", href: "/dashboard" },
    { icon: Receipt, title: "Receipts", href: "/receipts" },
    { icon: Users, title: "Add Friends", href: "/add-friends" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Migo AI" userName="Amit" />
      
      <div className="px-4 pt-4 pb-20">
        {/* Hero Section */}
        <div className="mb-8 relative">
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img 
              src={heroImage} 
              alt="Migo AI Receipt Management" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <Link to="/upload">
                <Button size="lg" className="h-12 px-8 shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            AI-powered insights for your expenses, just like Google Pay but for receipts
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Link key={index} to={step.href}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-3 text-center">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-xs">{step.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="mt-8 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Your spending this month</h3>
            <p className="text-3xl font-bold mb-1">₹8,921</p>
            <p className="text-sm opacity-90">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
