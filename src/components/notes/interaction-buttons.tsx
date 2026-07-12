'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InteractionButtons({ 
  noteId, 
  initialLikes, 
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
  userId
}: { 
  noteId: string, 
  initialLikes: number, 
  isLiked: boolean,
  isBookmarked: boolean,
  userId?: string 
}) {
  const supabase = createClient()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)

  const handleLike = async () => {
    if (!userId) return alert('Please login to like notes.')
    
    // Optimistic UI
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    
    if (isLiked) {
      await supabase.from('user_likes').delete().eq('content_item_id', noteId).eq('user_id', userId)
      await supabase.rpc('decrement_like', { item_id: noteId })
    } else {
      await supabase.from('user_likes').insert({ content_item_id: noteId, user_id: userId })
      await supabase.rpc('increment_like', { item_id: noteId })
    }
  }

  const handleBookmark = async () => {
    if (!userId) return alert('Please login to bookmark notes.')
    
    setIsBookmarked(!isBookmarked)
    
    if (isBookmarked) {
      await supabase.from('user_bookmarks').delete().eq('content_item_id', noteId).eq('user_id', userId)
    } else {
      await supabase.from('user_bookmarks').insert({ content_item_id: noteId, user_id: userId })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="flex items-center gap-4 py-6 border-y border-border/50">
      <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-500/10" : "text-muted-foreground"}>
        <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
        {likes} Likes
      </Button>
      <Button variant="ghost" size="sm" onClick={handleBookmark} className={isBookmarked ? "text-primary hover:text-primary hover:bg-primary/10" : "text-muted-foreground"}>
        <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
        Save
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground">
        <Share2 className="w-5 h-5 mr-2" />
        Share
      </Button>
    </div>
  )
}
