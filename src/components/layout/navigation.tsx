import { Home, Camera, BarChart3, MessageCircle, Settings, Receipt, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Camera, label: "Scan", href: "/upload" },
  { icon: Receipt, label: "Receipts", href: "/receipts" },
  { icon: Users, label: "Friends", href: "/add-friends" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}