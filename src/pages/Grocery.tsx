import { Plus, ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { useState } from "react"

const Grocery = () => {
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: "Milk", category: "Dairy", checked: false },
    { id: 2, name: "Bread", category: "Bakery", checked: false },
    { id: 3, name: "Eggs", category: "Dairy", checked: true },
    { id: 4, name: "Apples", category: "Fruits", checked: false },
    { id: 5, name: "Rice", category: "Grains", checked: false },
    { id: 6, name: "Chicken", category: "Meat", checked: false },
    { id: 7, name: "Tomatoes", category: "Vegetables", checked: false },
    { id: 8, name: "Onions", category: "Vegetables", checked: false },
  ])

  const toggleItem = (id: number) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const categories = ["Dairy", "Bakery", "Fruits", "Vegetables", "Grains", "Meat"]
  const uncheckedCount = groceryItems.filter(item => !item.checked).length

  return (
    <div className="min-h-screen bg-background">
      <Header title="Grocery List" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Grocery List</h1>
          <p className="text-muted-foreground">
            What to buy next month? ({uncheckedCount} items remaining)
          </p>
        </div>

        {/* Quick Stats */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{groceryItems.length}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{groceryItems.filter(item => item.checked).length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{uncheckedCount}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Item Button */}
        <Button className="w-full mb-4" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>

        {/* Grocery Items by Category */}
        {categories.map(category => {
          const categoryItems = groceryItems.filter(item => item.category === category)
          if (categoryItems.length === 0) return null

          return (
            <Card key={category} className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categoryItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                          item.checked ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.name}
                      </label>
                      {item.checked && (
                        <Check className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* AI Suggestions */}
        <Card className="mt-6 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">AI Suggestions</h3>
            <p className="text-sm opacity-90">
              Based on your spending patterns, consider adding protein bars and Greek yogurt to your list.
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  )
}

export default Grocery