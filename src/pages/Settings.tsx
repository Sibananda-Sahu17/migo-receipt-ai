import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Wallet,
  Database
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Settings() {
  const navigate = useNavigate()
  
  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile Settings", hasArrow: true },
        { icon: Mail, label: "Connect Gmail", hasArrow: true },
        { icon: Wallet, label: "Google Wallet", hasArrow: true },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", hasToggle: true, enabled: true },
        { icon: Database, label: "Auto-track from SMS", hasToggle: true, enabled: false },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", hasArrow: true },
        { icon: Shield, label: "Privacy Policy", hasArrow: true },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Amit Kumar</h2>
                <p className="text-muted-foreground">amit.kumar@example.com</p>
                <p className="text-sm text-muted-foreground mt-1">Member since March 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Toggle */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-lg font-semibold mb-3">{group.title}</h3>
              <Card>
                <CardContent className="p-0">
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    return (
                      <div 
                        key={itemIndex}
                        className={`flex items-center justify-between p-4 ${
                          itemIndex < group.items.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        
                        {item.hasArrow && (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        
                        {item.hasToggle && (
                          <Switch defaultChecked={item.enabled} />
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full" 
              size="lg"
              onClick={() => navigate("/login")}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Migo AI v1.0.0
        </div>
      </div>

      <Navigation />
    </div>
  )
}