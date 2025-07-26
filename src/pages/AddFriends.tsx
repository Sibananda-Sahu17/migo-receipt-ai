import { useState } from "react"
import { Search, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"

const AddFriends = () => {
  const [searchEmail, setSearchEmail] = useState("")
  
  const friends = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar: "JD"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "SW"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "MJ"
    }
  ]

  const handleAddFriend = () => {
    if (searchEmail.trim()) {
      // Handle add friend logic here
      console.log("Adding friend:", searchEmail)
      setSearchEmail("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Add Friends" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleAddFriend}
            className="w-full"
            disabled={!searchEmail.trim()}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>

        {/* Current Friends Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Your Friends ({friends.length})</h2>
          </div>
          
          <div className="space-y-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {friend.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Split
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {friends.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No friends added yet</p>
              <p className="text-sm text-muted-foreground">Search by email to add friends</p>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  )
}

export default AddFriends