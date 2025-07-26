import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Mic, Bot, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useChat } from "@/hooks/use-chat"
import { ChatSession, ChatMessage } from "@/api/chat"

export default function Chat() {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoize the error callback to prevent unnecessary re-renders
  const handleError = useCallback((error: string) => {
    console.error('Chat error:', error);
    // You can add toast notifications here
  }, []);

  const {
    isConnected,
    isConnecting,
    sessions,
    currentSession,
    messages,
    sendMessage,
    createSession,
    loadSession,
    deleteSession,
    loadSessions,
    setCurrentSession,
    setMessages
  } = useChat({
    email: user?.email || '',
    onError: handleError
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !user) return;

    // Send message directly - session will be created by WebSocket if needed
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, user, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleNewChat = useCallback(async () => {
    try {
      // Clear current session and messages to show the welcome screen
      setCurrentSession(null);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  }, [setCurrentSession, setMessages]);

  const handleLoadSession = useCallback(async (session: ChatSession) => {
    try {
      await loadSession(session.id);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }, [loadSession]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }, [deleteSession]);

  const quickQuestions = [
    "How much did I spend on groceries this month?",
    "What's my average daily spending?",
    "Show me my food expenses",
    "Find my largest expense this week",
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Please log in to access the chat feature.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="AI Chat Assistant" 
        showProfile={false} 
        showHamburger={true}
        onHamburgerClick={() => setSidebarOpen(true)}
      />
      
      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSession={currentSession}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              {currentSession?.title || 'New Chat'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </div>
          </div>
          {!currentSession && (
            <Button onClick={handleNewChat} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 pt-4 pb-20 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 && !currentSession && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to AI Chat!</h3>
                  <p className="text-muted-foreground mb-4">
                    I can help you analyze your expenses, find spending patterns, and answer questions about your receipts.
                  </p>
                  
                  {/* Quick Questions */}
                  <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto p-3"
                        onClick={() => setInputValue(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'ai' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your expenses..."
                  className="pr-12"
                  disabled={!isConnected}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  disabled={!isConnected}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || !isConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}