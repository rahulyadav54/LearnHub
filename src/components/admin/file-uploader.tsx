"use client"

import { useState } from "react"
import { uploadFile } from "@/lib/supabase-storage"
import { UploadCloud, Loader2 } from "lucide-react"

interface FileUploaderProps {
  bucket: 'images' | 'pdfs'
  folderPath?: string
  onUploadSuccess: (url: string) => void
}

export function FileUploader({ bucket, folderPath = '', onUploadSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const { url, error: uploadError } = await uploadFile(bucket, file, folderPath)
    
    if (uploadError) {
      setError(uploadError.message)
    } else if (url) {
      onUploadSuccess(url)
    }
    
    setIsUploading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
          )}
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {bucket === 'images' ? 'PNG, JPG or WEBP' : 'PDF files only'}
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept={bucket === 'images' ? 'image/*' : 'application/pdf'} 
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}
