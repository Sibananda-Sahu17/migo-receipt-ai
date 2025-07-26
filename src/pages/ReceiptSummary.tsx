import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Calendar, Tag, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"

export default function ReceiptSummary() {
  const { receiptId } = useParams()
  const navigate = useNavigate()

  // Mock data - in real app, fetch from API using receiptId
  const receipt = {
    id: receiptId,
    merchant: "Starbucks Coffee",
    amount: "₹450",
    date: "Today, 2:30 PM",
    category: "Food",
    status: "Processed",
    items: [
      { name: "Coffee Latte", price: "₹250" },
      { name: "Chocolate Muffin", price: "₹120" },
      { name: "Service Tax", price: "₹80" }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-500/10 text-green-600"
      case "Processing": return "bg-yellow-500/10 text-yellow-600"
      case "Pending": return "bg-gray-500/10 text-gray-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  const handleSplitWithFriends = () => {
    navigate("/split-with-friends", { state: { receiptData: receipt } })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Receipt Details" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20 max-w-lg mx-auto w-full">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate('/receipts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Receipts
        </Button>

        {/* Receipt Header */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{receipt.merchant}</CardTitle>
                <p className="text-2xl font-bold text-primary mt-2">{receipt.amount}</p>
              </div>
              <Badge className={`${getStatusColor(receipt.status)}`}>
                {receipt.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{receipt.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>{receipt.category}</span>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="text-sm">{item.name}</span>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={handleSplitWithFriends}
          >
            <Users className="h-4 w-4 mr-2" />
            Split with Friends
          </Button>
          
          <Button variant="outline" className="w-full">
            <DollarSign className="h-4 w-4 mr-2" />
            Export Receipt
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  )
} 