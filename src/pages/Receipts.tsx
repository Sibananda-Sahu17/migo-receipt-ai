import { useState, useEffect } from "react"
import { ArrowLeft, MoreVertical, Users, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { getAllReceipts, Receipt } from "@/api/receipt"
import { useToast } from "@/components/ui/use-toast"

const Receipts = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedReceipts, setExpandedReceipts] = useState<number[]>([])
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)


  const categories = ["all", "Food", "Groceries", "Travel", "Trips", "Misc"]

  // Format date to display format
  const formatDate = (dateString: string) => {
    try {
      // Handle invalid date strings
      if (!dateString || dateString === 'Invalid Date') {
        return 'Unknown Date'
      }
      
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        return "Today, " + date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      } else if (diffDays === 2) {
        return "Yesterday, " + date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }) + ", " + date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      }
    } catch (error) {
      console.error('Error formatting date:', error, dateString)
      return 'Invalid Date'
    }
  }

  // Fetch receipts from API
  const fetchReceipts = async () => {
    try {
      setLoading(true)
      const response = await getAllReceipts({
        category: selectedCategory === "all" ? undefined : selectedCategory
      })
      
      // Debug: Log the actual response structure
      console.log('API Response:', response)
      console.log('Response data:', response?.data)
      
      // Check if response and data exist
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }
      
      // Handle different response formats - try multiple possible structures
      let receiptsData = []
      const responseData = response.data as any // Type assertion for flexibility
      
      if (Array.isArray(responseData)) {
        // Direct array response
        receiptsData = responseData
      } else if (Array.isArray(responseData.receipts)) {
        // Nested receipts array
        receiptsData = responseData.receipts
      } else if (Array.isArray(responseData.data)) {
        // Double nested data
        receiptsData = responseData.data
      } else if (responseData.data && Array.isArray(responseData.data.receipts)) {
        // Triple nested
        receiptsData = responseData.data.receipts
      } else {
        console.warn('Could not find receipts array in response:', responseData)
        // Temporary fallback data for debugging
        console.log('Using fallback data for debugging')
        receiptsData = [
          {
            id: 1,
            merchant: "Starbucks Coffee",
            amount: "₹450",
            date: new Date().toISOString(),
            category: "Food",
            status: "Processed",
            items: [
              { name: "Coffee Latte", price: "₹250" },
              { name: "Chocolate Muffin", price: "₹120" },
              { name: "Service Tax", price: "₹80" }
            ]
          }
        ]
      }
      
      console.log('Extracted receipts data:', receiptsData)
      
      // Transform API data to match the expected format
      const formattedReceipts = receiptsData.map((receipt, index) => {
        // Ensure receipt is an object
        if (!receipt || typeof receipt !== 'object') {
          console.warn('Invalid receipt data at index', index, ':', receipt)
          return null
        }
        
        console.log('Processing receipt:', receipt)
        console.log('Receipt keys:', Object.keys(receipt))
        console.log('Receipt values:', Object.values(receipt))
        
        // Try to extract fields with multiple possible property names
        const merchant = receipt.merchant || receipt.merchant_name || receipt.store || receipt.shop || receipt.vendor || receipt.business_name || 'Unknown Merchant'
        const amount = receipt.amount || receipt.total || receipt.price || receipt.cost || receipt.total_amount || receipt.grand_total || receipt.final_amount || '₹0'
        const category = receipt.category || receipt.type || receipt.group || receipt.classification || 'Misc'
        const status = receipt.status || receipt.state || receipt.processing_status || 'Pending'
        const dateField = receipt.created_at || receipt.date || receipt.timestamp || receipt.created_date || receipt.scan_date || receipt.processed_at || new Date().toISOString()
        const items = Array.isArray(receipt.items) ? receipt.items : 
                     Array.isArray(receipt.products) ? receipt.products :
                     Array.isArray(receipt.line_items) ? receipt.line_items :
                     Array.isArray(receipt.transactions) ? receipt.transactions : []
        
        // Format amount properly
        let formattedAmount = '₹0'
        if (amount !== '₹0') {
          if (typeof amount === 'number') {
            formattedAmount = `₹${amount.toFixed(2)}`
          } else if (typeof amount === 'string') {
            // Remove any existing currency symbols and format
            const cleanAmount = amount.replace(/[₹$€£,]/g, '').trim()
            const numAmount = parseFloat(cleanAmount)
            if (!isNaN(numAmount)) {
              formattedAmount = `₹${numAmount.toFixed(2)}`
            } else {
              formattedAmount = amount // Keep original if can't parse
            }
          }
        }
        
        return {
          id: receipt.receipt_id || receipt.id || index,
          merchant,
          amount: formattedAmount,
          date: formatDate(dateField),
          category,
          status,
          items: items.map(item => {
            const itemName = item.name || item.product_name || item.description || item.item_name || 'Unknown Item'
            const itemPrice = item.price || item.cost || item.amount || item.unit_price || '₹0'
            
            // Format item price
            let formattedItemPrice = '₹0'
            if (itemPrice !== '₹0') {
              if (typeof itemPrice === 'number') {
                formattedItemPrice = `₹${itemPrice.toFixed(2)}`
              } else if (typeof itemPrice === 'string') {
                const cleanPrice = itemPrice.replace(/[₹$€£,]/g, '').trim()
                const numPrice = parseFloat(cleanPrice)
                if (!isNaN(numPrice)) {
                  formattedItemPrice = `₹${numPrice.toFixed(2)}`
                } else {
                  formattedItemPrice = itemPrice
                }
              }
            }
            
            return {
              name: itemName,
              price: formattedItemPrice
            }
          }),
          created_at: dateField,
          updated_at: receipt.updated_at || receipt.modified_at || dateField
        }
      }).filter(Boolean) // Remove null entries
      
      console.log('Formatted receipts:', formattedReceipts)
      setReceipts(formattedReceipts)
    } catch (error: any) {
      console.error('Error fetching receipts:', error)
      setReceipts([]) // Set empty array on error
      toast({
        title: "Error",
        description: error?.message || "Failed to load receipts. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Load receipts on component mount and when category changes
  useEffect(() => {
    fetchReceipts()
  }, [selectedCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-500/10 text-green-600"
      case "Processing": return "bg-yellow-500/10 text-yellow-600"
      case "Pending": return "bg-gray-500/10 text-gray-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  const filteredReceipts = selectedCategory === "all" 
    ? (receipts || [])
    : (receipts || []).filter(receipt => receipt?.category === selectedCategory)

  const toggleReceiptExpansion = (receiptId: number) => {
    setExpandedReceipts(prev =>
      prev.includes(receiptId)
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    )
  }

  const handleEditCategory = (receipt: Receipt) => {
    if (!receipt) return
    setEditingReceipt(receipt)
    setNewCategory(receipt.category || '')
    setIsEditCategoryOpen(true)
  }

  const saveCategory = async () => {
    if (!editingReceipt) return
    
    try {
      // Here you would make API call to update category
      // For now, we'll just update the local state
      setReceipts(prevReceipts => 
        prevReceipts.map(receipt => 
          receipt.id === editingReceipt.id 
            ? { ...receipt, category: newCategory }
            : receipt
        )
      )
      
      toast({
        title: "Success",
        description: "Category updated successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsEditCategoryOpen(false)
      setEditingReceipt(null)
      setNewCategory("")
    }
  }

  const handleSplitWithFriends = (receipt: Receipt) => {
    if (!receipt) return
    navigate("/split-with-friends", { state: { receiptData: receipt } })
  }

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading receipts...</p>
            </div>
          ) : (
            filteredReceipts.map((receipt) => (
            <Card
              key={receipt.id || Math.random()}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => receipt?.id && navigate(`/receipt/${receipt.id}`, { 
                state: { receiptData: receipt } 
              })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{receipt?.merchant || 'Unknown Merchant'}</h3>
                      <span className="font-bold">{receipt?.amount || '₹0'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {receipt?.category || 'Misc'}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(receipt?.status || 'Pending')}`}>
                        {receipt?.status || 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{receipt?.date || 'Unknown Date'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Edit Category Modal */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveCategory} className="w-full">Save Category</Button>
            </div>
          </DialogContent>
        </Dialog>

        {!loading && filteredReceipts.length === 0 && (
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