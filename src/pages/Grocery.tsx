import { Plus, ShoppingBag, Check, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { useState } from "react"

const Grocery = () => {
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: "Milk", category: "Dairy", checked: false, quantity: "2L" },
    { id: 2, name: "Bread", category: "Bakery", checked: false, quantity: "1 loaf" },
    { id: 3, name: "Eggs", category: "Dairy", checked: true, quantity: "12 pcs" },
    { id: 4, name: "Apples", category: "Fruits", checked: false, quantity: "1 kg" },
    { id: 5, name: "Rice", category: "Grains", checked: false, quantity: "5 kg" },
    { id: 6, name: "Chicken", category: "Meat", checked: false, quantity: "500g" },
    { id: 7, name: "Tomatoes", category: "Vegetables", checked: false, quantity: "1 kg" },
    { id: 8, name: "Onions", category: "Vegetables", checked: false, quantity: "2 kg" },
  ])
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({ name: "", quantity: "", category: "Dairy" })

  const toggleItem = (id: number) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const deleteItem = (id: number) => {
    setGroceryItems(items => items.filter(item => item.id !== id))
  }

  const editItem = (item) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const saveEditItem = () => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === editingItem.id ? editingItem : item
      )
    )
    setIsEditModalOpen(false)
    setEditingItem(null)
  }

  const addNewItem = () => {
    if (newItem.name && newItem.quantity) {
      const id = Math.max(...groceryItems.map(item => item.id)) + 1
      setGroceryItems(items => [...items, {
        id,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        checked: false
      }])
      setNewItem({ name: "", quantity: "", category: "Dairy" })
      setIsAddModalOpen(false)
    }
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
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addNewItem} className="w-full">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* All Grocery Items in One Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {categories.map(category => {
              const categoryItems = groceryItems.filter(item => item.category === category)
              if (categoryItems.length === 0) return null

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                          <label
                            htmlFor={`item-${item.id}`}
                            className={`text-base font-medium cursor-pointer ${
                              item.checked ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {item.name}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {item.checked && (
                            <Check className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Edit Item Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingItem.category} onValueChange={(value) => setEditingItem({...editingItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveEditItem} className="w-full">Save Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

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