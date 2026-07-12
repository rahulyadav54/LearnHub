'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { toggleScholarshipBookmark } from '@/app/actions/scholarship-actions'

export function ScholarshipBookmarkButton({
  scholarshipId,
  initialBookmarked
}: {
  scholarshipId: string
  initialBookmarked: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)

  const handleToggle = () => {
    // Optimistic update
    setBookmarked(!bookmarked)
    startTransition(async () => {
      try {
        await toggleScholarshipBookmark(scholarshipId)
      } catch (err) {
        // Revert on error
        setBookmarked(bookmarked)
      }
    })
  }

  return (
    <Button 
      variant={bookmarked ? "default" : "outline"} 
      size="icon" 
      onClick={(e) => {
        e.preventDefault() // Prevent navigation if inside a link
        handleToggle()
      }}
      disabled={isPending}
      className={bookmarked ? "bg-primary text-primary-foreground" : ""}
      title={bookmarked ? "Remove Bookmark" : "Save Scholarship"}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
    </Button>
  )
}
