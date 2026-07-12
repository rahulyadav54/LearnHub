'use client'

import { useState, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Moon, Sun, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFReaderProps {
  url: string
  initialPage?: number
  onPageChange?: (page: number, total: number) => void
}

export function PDFReader({ url, initialPage = 1, onPageChange }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(initialPage)
  const [scale, setScale] = useState(1.0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    if (onPageChange) onPageChange(pageNumber, numPages)
  }

  const changePage = (offset: number) => {
    const newPage = Math.min(Math.max(1, pageNumber + offset), numPages)
    setPageNumber(newPage)
    if (onPageChange) onPageChange(newPage, numPages)
  }

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3.0))
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5))

  return (
    <div className="flex flex-col bg-muted/30 border rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-background border-b z-10 sticky top-0 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-24 text-center">
            {pageNumber} / {numPages || '--'}
          </span>
          <Button variant="outline" size="icon" onClick={() => changePage(1)} disabled={pageNumber >= numPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className={`relative flex justify-center p-4 min-h-[600px] overflow-auto bg-muted ${isDarkMode ? 'dark-pdf-mode' : ''}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .dark-pdf-mode .react-pdf__Page__canvas {
            filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
        `}} />
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[600px] w-full text-muted-foreground animate-pulse">
              Loading PDF Document...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[600px] w-full text-destructive">
              Failed to load PDF. Please try downloading it instead.
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            className="shadow-xl rounded-sm transition-all"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 bg-muted w-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${(pageNumber / (numPages || 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
