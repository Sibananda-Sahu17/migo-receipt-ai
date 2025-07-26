import { useState } from "react"
import { Calendar, DollarSign, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export default function Untracked() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [untrackedExpenses, setUntrackedExpenses] = useState([
    {
      id: 1,
      name: "Amazon Purchase",
      amount: "₹1,299",
      date: "2024-01-15",
      description: "Online purchase detected from email"
    },
    {
      id: 2,
      name: "Uber Ride",
      amount: "₹245",
      date: "2024-01-14",
      description: "Transportation expense from email notification"
    },
    {
      id: 3,
      name: "Swiggy Order",
      amount: "₹485",
      date: "2024-01-13",
      description: "Food delivery detected from email"
    },
    {
      id: 4,
      name: "Netflix Subscription",
      amount: "₹649",
      date: "2024-01-12",
      description: "Recurring subscription payment"
    },
    {
      id: 5,
      name: "Petrol Pump",
      amount: "₹2,500",
      date: "2024-01-11",
      description: "Fuel expense detected from SMS"
    }
  ])

  const handleUploadReceipt = (expenseId: number) => {
    toast({
      title: "Upload Receipt",
      description: "Redirecting to upload page...",
    })
    navigate("/upload")
  }

  const handleAddToMiscellaneous = (expense: any) => {
    // Remove from untracked expenses
    setUntrackedExpenses(prev => prev.filter(item => item.id !== expense.id))
    
    // Add to receipts (in a real app, this would persist to backend/storage)
    const miscReceipt = {
      id: Date.now(),
      merchant: expense.name,
      amount: expense.amount,
      date: expense.date,
      category: "Miscellaneous",
      items: [{
        name: expense.name,
        price: expense.amount
      }]
    }
    
    toast({
      title: "Added to Miscellaneous",
      description: `${expense.name} has been added to your receipts as miscellaneous`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Untracked Expenses" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Summary Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Untracked</h3>
              <p className="text-2xl font-bold text-destructive">₹5,178</p>
              <p className="text-sm text-muted-foreground">
                {untrackedExpenses.length} expenses found from notifications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Untracked Expenses */}
        <div className="space-y-4">
          {untrackedExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{expense.name}</h3>
                      <Badge variant="destructive" className="text-xs">
                        Untracked
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {expense.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {expense.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {expense.amount}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUploadReceipt(expense.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Receipt
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToMiscellaneous(expense)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Misc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  )
}