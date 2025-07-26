import { User, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  title: string
  showProfile?: boolean
  userName?: string
  showHamburger?: boolean
  onHamburgerClick?: () => void
}

export function Header({ title, showProfile = true, userName, showHamburger = false, onHamburgerClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showHamburger && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHamburgerClick}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {showProfile && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              {userName && (
                <div>
                  <p className="text-sm font-medium">Welcome,</p>
                  <p className="text-lg font-semibold">{userName}</p>
                </div>
              )}
            </div>
          )}
          {!showProfile && (
            <h1 className="text-xl font-semibold">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}