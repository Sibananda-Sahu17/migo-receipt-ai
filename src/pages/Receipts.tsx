import { useState } from "react"
import { ArrowLeft, MoreVertical, Users, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Receipts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const receipts = [
    {
      id: 1,
      merchant: "Starbucks Coffee",
      amount: "₹450",
      date: "Today, 2:30 PM",
      category: "Food",
      status: "Processed"
    },
    {
      id: 2,
      merchant: "BigBasket",
      amount: "₹2,850",
      date: "Yesterday, 6:15 PM",
      category: "Groceries",
      status: "Processing"
    },
    {
      id: 3,
      merchant: "Uber",
      amount: "₹180",
      date: "Dec 23, 9:45 AM",
      category: "Travel",
      status: "Pending"
    },
    {
      id: 4,
      merchant: "Amazon",
      amount: "₹1,200",
      date: "Dec 22, 3:20 PM",
      category: "Misc",
      status: "Processed"
    }
  ]

  const categories = ["all", "Food", "Groceries", "Travel", "Trips", "Misc"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-500/10 text-green-600"
      case "Processing": return "bg-yellow-500/10 text-yellow-600"
      case "Pending": return "bg-gray-500/10 text-gray-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  const filteredReceipts = selectedCategory === "all" 
    ? receipts 
    : receipts.filter(receipt => receipt.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Receipts" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Filter Section */}
        <div className="flex items-center justify-between mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Receipts List */}
        <div className="space-y-3">
          {filteredReceipts.map((receipt) => (
            <Card key={receipt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{receipt.merchant}</h3>
                      <span className="font-bold">{receipt.amount}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {receipt.category}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{receipt.date}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Split with Friends
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Category</DropdownMenuItem>
                      <DropdownMenuItem>Add to Wallet</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReceipts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No receipts found for this category</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}

export default Receipts