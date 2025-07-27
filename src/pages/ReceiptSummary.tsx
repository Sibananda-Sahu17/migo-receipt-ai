import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, Users, Calendar, Tag, DollarSign, Loader2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { getReceiptById, Receipt } from "@/api/receipt"
import { useToast } from "@/components/ui/use-toast"

export default function ReceiptSummary() {
  const { receiptId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveUrl, setSaveUrl] = useState<string | null>(null)

  // Format date to display format (same as Receipts.tsx)
  const formatDate = (dateString: string) => {
    try {
      if (!dateString || dateString === 'Invalid Date') {
        return 'Unknown Date'
      }
      
      const date = new Date(dateString)
      
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

  // Fetch receipt data
  const fetchReceipt = async () => {
    if (!receiptId) {
      setError('Receipt ID is required')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // First, try to get data from navigation state (if coming from receipts list)
      const stateReceipt = location.state?.receiptData
      if (stateReceipt) {
        console.log('Using receipt data from navigation state:', stateReceipt)
        setReceipt(stateReceipt)
        setLoading(false)
        return
      }

      // If no state data, fetch from API
      console.log('Fetching receipt from API with ID:', receiptId)
      const response = await getReceiptById(receiptId)
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }

      const receiptData = response.data as any
      console.log('API Response:', receiptData)

      // Transform API data to match expected format
      const formattedReceipt: Receipt = {
        id: receiptData.receipt_id || receiptData.id || receiptId,
        merchant: receiptData.merchant || receiptData.merchant_name || receiptData.store || receiptData.shop || receiptData.vendor || receiptData.business_name || 'Unknown Merchant',
        amount: receiptData.amount || receiptData.total || receiptData.price || receiptData.cost || receiptData.total_amount || receiptData.grand_total || receiptData.final_amount || '₹0',
        date: formatDate(receiptData.created_at || receiptData.date || receiptData.timestamp || receiptData.created_date || receiptData.scan_date || receiptData.processed_at || new Date().toISOString()),
        category: receiptData.category || receiptData.type || receiptData.group || receiptData.classification || 'Misc',
        status: receiptData.status || receiptData.state || receiptData.processing_status || 'Pending',
        items: Array.isArray(receiptData.items) ? receiptData.items.map((item: any) => ({
          name: item.name || item.product_name || item.description || item.item_name || 'Unknown Item',
          price: item.price || item.cost || item.amount || item.unit_price || '₹0'
        })) : [],
        created_at: receiptData.created_at || receiptData.date || receiptData.timestamp || receiptData.created_date || new Date().toISOString(),
        updated_at: receiptData.updated_at || receiptData.modified_at || receiptData.created_at || new Date().toISOString()
      }

      setReceipt(formattedReceipt)
    } catch (error: any) {
      console.error('Error fetching receipt:', error)
      setError(error?.message || 'Failed to load receipt')
      toast({
        title: "Error",
        description: "Failed to load receipt details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Load receipt data on component mount
  useEffect(() => {
    fetchReceipt()
  }, [receiptId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-500/10 text-green-600"
      case "Processing": return "bg-yellow-500/10 text-yellow-600"
      case "Pending": return "bg-gray-500/10 text-gray-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  const handleSplitWithFriends = () => {
    if (!receipt) return
    navigate("/split-with-friends", { state: { receiptData: receipt } })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading receipt details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Receipt Details" showProfile={false} />
        <div className="px-4 pt-4 pb-20 max-w-lg mx-auto w-full">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => navigate('/receipts')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Receipts
          </Button>
          
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error || 'Receipt not found'}
              </p>
              <Button onClick={() => navigate('/receipts')}>
                Back to Receipts
              </Button>
            </CardContent>
          </Card>
        </div>
        <Navigation />
      </div>
    )
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
          
          <a href={saveUrl} className="w-full">
            <DollarSign className="h-4 w-4 mr-2" />
            Export Receipt
          </a>
        </div>
      </div>

      <Navigation />
    </div>
  )
} 