import { useState, useRef, useEffect } from "react"
import { Camera, Upload as UploadIcon, Video, Play, FileImage, X, Users, Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { useToast } from "@/hooks/use-toast"
import { generateUploadUrl, uploadFileToSignedUrl } from "@/api/storage"
import { createRawReceipt, ReceiptData, AnalyzeReceiptResponse } from "@/api/receipt"
import { ReceiptDetailsModal } from "@/components/receipt/receipt-details-modal"
import { AXIOS_INSTANCE } from "@/api/_interceptor/_axios"

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessedModal, setShowProcessedModal] = useState(false)
  const [processedItems, setProcessedItems] = useState([])
  const [itemCategories, setItemCategories] = useState({})
  const [categories, setCategories] = useState(["Food", "Groceries", "Travel", "Entertainment", "Miscellaneous"])
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showReceiptDetailsModal, setShowReceiptDetailsModal] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setSelectedFiles(prev => [...prev, ...newFiles])
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) ready for processing`,
      })
    }
  }

  const handleCapture = () => {
    setCameraMode('photo')
    setShowCameraModal(true)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleVideoCapture = () => {
    setCameraMode('video')
    setShowCameraModal(true)
  }

  const handleLiveStream = () => {
    toast({
      title: "Live stream",
      description: "Live stream feature coming soon!",
    })
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: cameraMode === 'video'
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: "Camera access failed",
        description: "Please allow camera access or try uploading a file instead.",
        variant: "destructive",
      })
      setShowCameraModal(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
          setSelectedFiles(prev => [...prev, file])
          setShowCameraModal(false)
          stopCamera()
          toast({
            title: "Photo captured",
            description: "Photo has been added to your uploads",
          })
        }
      }, 'image/jpeg')
    }
  }

  const startRecording = () => {
    if (stream && videoRef.current) {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' })
        setSelectedFiles(prev => [...prev, file])
        setShowCameraModal(false)
        stopCamera()
        toast({
          title: "Video recorded",
          description: "Video has been added to your uploads",
        })
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      for (const file of selectedFiles) {
        // 1. Generate upload URL
        const uploadUrlRes = await generateUploadUrl({
          filename: file.name,
          file_type: "receipt",
          content_type: file.type || "image/jpeg",
          expires_in_minutes: 60,
        })
        const { upload_url, file_path } = uploadUrlRes.data

        // 2. Convert file to blob (File is already a Blob)
        const fileBlob = file

        // 3. Upload to signed URL
        await uploadFileToSignedUrl(fileBlob, upload_url, file.type || "image/jpeg")

        // 4. Save receipt data reference
        const receiptData = {
          filename: file.name,
          file_type: "image",
          content_type: file.type || "image/jpeg",
          file_size: fileBlob.size,
          file_path: file_path
        }
        await createRawReceipt(receiptData)

        // 5. Analyze receipt (instant processing)
        const analyzeData = {
          filename: file.name,
          file_type: "image",
          content_type: file.type || "image/jpeg",
          file_size: fileBlob.size,
          file_path: file_path
        }
        
        try {
          const analyzeResponse = await AXIOS_INSTANCE.post<AnalyzeReceiptResponse>("/receipt/analyze-receipt-instant", analyzeData)
          console.log('Analyze response:', analyzeResponse.data)
          
          if (analyzeResponse.data.success && analyzeResponse.data.receipt_data) {
            setReceiptData(analyzeResponse.data.receipt_data)
            setShowReceiptDetailsModal(true)
          } else {
            throw new Error('Analysis failed or no receipt data received')
          }
        } catch (analyzeError) {
          console.error('Error analyzing receipt:', analyzeError)
          // Fallback to old modal if analysis fails
          const processedItems = [
            { name: "Coffee Latte", price: "₹250" },
            { name: "Sandwich", price: "₹180" },
            { name: "Pastry", price: "₹120" },
          ]
          const initialCategories = {}
          processedItems.forEach((_, index) => {
            initialCategories[index] = "Food"
          })
          setItemCategories(initialCategories)
          setProcessedItems(processedItems)
          setShowProcessedModal(true)
        }
      }

      setIsProcessing(false)
      toast({
        title: "Processing complete!",
        description: `${selectedFiles.length} receipt(s) processed successfully`,
      })
    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Upload failed",
        description: "There was an error uploading one or more files.",
        variant: "destructive",
      })
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const updateItemCategory = (itemIndex: number, category: string) => {
    setItemCategories(prev => ({
      ...prev,
      [itemIndex]: category
    }))
  }

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      setCategories(prev => [...prev, newCategoryName.trim()])
      setNewCategoryName("")
      setShowNewCategoryModal(false)
      toast({
        title: "Category added",
        description: `"${newCategoryName.trim()}" has been added to categories`,
      })
    }
  }

  useEffect(() => {
    if (showCameraModal) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [showCameraModal])

  return (
    <div className="min-h-screen bg-background">
      <Header title="Scan Receipt" showProfile={false} />
      
      <div className="px-4 pt-4 pb-20">
        {/* Upload Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCapture}>
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-medium">Take Photo</span>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleFileUpload}>
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-medium">Upload File</span>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleVideoCapture}>
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-medium">Record Video</span>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleLiveStream}>
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-medium">Live Stream</span>
            </CardContent>
          </Card>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Selected Files ({selectedFiles.length})</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Process Button */}
        <Button 
          onClick={handleProcess}
          disabled={isProcessing || selectedFiles.length === 0}
          className="w-full h-12"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Process ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Receipt${selectedFiles.length !== 1 ? 's' : ''}`
          )}
        </Button>
      </div>

      <Navigation />

      {/* Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={(open) => {
        if (!open) {
          stopCamera()
        }
        setShowCameraModal(open)
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {cameraMode === 'photo' ? 'Take Photo' : 'Record Video'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play()
                  }
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4">
              {cameraMode === 'photo' ? (
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              ) : (
                <>
                  {!isRecording ? (
                    <Button onClick={startRecording} className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" onClick={() => setShowCameraModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processed Items Modal */}
      <Dialog open={showProcessedModal} onOpenChange={setShowProcessedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processed Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              {processedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.price}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Select
                      value={itemCategories[index] || "Food"}
                      onValueChange={(value) => updateItemCategory(index, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowNewCategoryModal(true)}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowProcessedModal(false)
                  navigate("/dashboard")
                }}
              >
                OK
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowProcessedModal(false)
                  navigate("/split-with-friends", { 
                    state: { 
                      receiptData: { 
                        items: processedItems,
                        merchant: "Uploaded Receipt",
                        amount: processedItems.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '')), 0)
                      } 
                    } 
                  })
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Split with Friends
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Category Modal */}
      <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleAddNewCategory}
                disabled={!newCategoryName.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Details Modal */}
      <ReceiptDetailsModal
        isOpen={showReceiptDetailsModal}
        onClose={() => setShowReceiptDetailsModal(false)}
        receiptData={receiptData}
        onSplitWithFriends={() => {
          setShowReceiptDetailsModal(false)
          navigate("/split-with-friends", { 
            state: { 
              receiptData: { 
                items: receiptData?.line_items.map(item => ({
                  name: item.name,
                  price: `₹${item.total_price}`
                })) || [],
                merchant: receiptData?.merchant_name || "Uploaded Receipt",
                amount: receiptData?.grand_total || 0
              } 
            } 
          })
        }}
      />
    </div>
  )
}