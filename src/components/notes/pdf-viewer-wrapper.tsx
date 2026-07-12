'use client'

import { useCallback, useRef } from 'react'
import { PDFReader } from './pdf-reader'
import { syncReadingProgress } from '@/app/actions/reading-history'

export function PDFViewerWrapper({ url, noteId, initialPage = 1 }: { url: string, noteId: string, initialPage?: number }) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handlePageChange = useCallback((page: number, total: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    
    debounceTimer.current = setTimeout(() => {
      syncReadingProgress(noteId, page, total).catch(console.error)
    }, 1000) // 1 second debounce
  }, [noteId])

  return <PDFReader url={url} initialPage={initialPage} onPageChange={handlePageChange} />
}
