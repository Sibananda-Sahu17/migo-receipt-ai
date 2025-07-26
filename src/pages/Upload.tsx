import { useState } from "react"
import { Camera, Upload as UploadIcon, Video, Play, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
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
    // Camera capture logic would go here
    toast({
      title: "Camera capture",
      description: "Camera feature will be implemented",
    })
  }

  const handleVideoCapture = () => {
    // Video capture logic would go here
    toast({
      title: "Video capture",
      description: "Video capture feature will be implemented",
    })
  }

  const handleLiveStream = () => {
    // Live stream logic would go here
    toast({
      title: "Live stream",
      description: "Live stream feature will be implemented",
    })
  }

  const handleProcess = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Processing complete!",
        description: `${selectedFiles.length} receipt(s) processed successfully`,
      })
      setSelectedFiles([])
    }, 3000)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

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

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <label htmlFor="file-upload" className="font-medium cursor-pointer">
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
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
                      Remove
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
    </div>
  )
}