import { useState, useEffect } from "react"
import { Plus, Trash2, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChatSession } from "@/api/chat"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  currentSession: ChatSession | null
  onNewChat: () => void
  onLoadSession: (session: ChatSession) => void
  onDeleteSession: (sessionId: string) => void
}

export function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  currentSession,
  onNewChat,
  onLoadSession,
  onDeleteSession
}: ChatSidebarProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Chat Sessions</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b">
            <Button
              onClick={() => {
                onNewChat()
                onClose()
              }}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No chat sessions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start a new conversation to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 group ${
                      currentSession?.id === session.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => {
                      onLoadSession(session)
                      onClose()
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.title || '--'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSession(session.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* Always visible delete button on mobile */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSession(session.id)
                          }}
                          className="md:hidden"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 