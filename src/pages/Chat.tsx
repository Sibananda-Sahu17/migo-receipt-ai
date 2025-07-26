import { useState } from "react"
import { Send, Mic, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant. I can help you analyze your expenses, find spending patterns, and answer questions about your receipts. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your question! Based on your receipts, I can see some interesting patterns. For example, you've spent ₹8,921 this month with most expenses on groceries (45%). Would you like me to analyze any specific category or time period?",
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "How much did I spend on groceries this month?",
    "What's my average daily spending?",
    "Show me my food expenses",
    "Find my largest expense this week",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="AI Chat Assistant" showProfile={false} />
      
      <div className="flex-1 px-4 pt-4 pb-20 overflow-hidden">
        {/* Messages */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <Card className={`max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="grid grid-cols-1 gap-2">
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

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your expenses..."
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}