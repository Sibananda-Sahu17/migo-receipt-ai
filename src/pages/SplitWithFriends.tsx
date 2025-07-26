import { useState } from "react"
import { ArrowLeft, Check, Users, Receipt } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const SplitWithFriends = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const receiptData = location.state?.receiptData || null

  const [selectedFriends, setSelectedFriends] = useState<number[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>(
    receiptData?.items?.map((_, index) => index) || []
  )

  const friends = [
    { id: 1, name: "John Doe", email: "john@example.com", avatar: "" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", avatar: "" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", avatar: "" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", avatar: "" },
  ]

  const mockItems = [
    { id: 1, name: "Coffee Latte", price: "₹250" },
    { id: 2, name: "Sandwich", price: "₹180" },
    { id: 3, name: "Pastry", price: "₹120" },
  ]

  const items = receiptData?.items || mockItems

  const toggleFriend = (friendId: number) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const toggleItem = (itemIndex: number) => {
    setSelectedItems(prev =>
      prev.includes(itemIndex)
        ? prev.filter(id => id !== itemIndex)
        : [...prev, itemIndex]
    )
  }

  const handleSplit = () => {
    // Here you would make API call to split the bill
    navigate("/receipts")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Split with Friends" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Friends Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Friends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`friend-${friend.id}`}
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={() => toggleFriend(friend.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{friend.email}</p>
                  </div>
                  {selectedFriends.includes(friend.id) && (
                    <Check className="h-4 w-4 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Select Items to Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`item-${index}`}
                      checked={selectedItems.includes(index)}
                      onCheckedChange={() => toggleItem(index)}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}</p>
                    </div>
                  </div>
                  {selectedItems.includes(index) && (
                    <Check className="h-4 w-4 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Split Summary */}
        {selectedFriends.length > 0 && selectedItems.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Split Summary</h3>
                <p className="text-sm opacity-90">
                  {selectedItems.length} items with {selectedFriends.length} friends
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Split Button */}
        <Button 
          onClick={handleSplit}
          disabled={selectedFriends.length === 0 || selectedItems.length === 0}
          className="w-full h-12"
        >
          Send Split Request
        </Button>
      </div>

      <Navigation />
    </div>
  )
}

export default SplitWithFriends