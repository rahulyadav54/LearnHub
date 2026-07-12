/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type CommentType = {
  id: string
  content: string
  created_at: string
  profiles: { full_name: string, avatar_url: string } | null
}

export function CommentsSection({ noteId, userId }: { noteId: string, userId?: string }) {
  const supabase = createClient()
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('content_item_id', noteId)
        .order('created_at', { ascending: false })
      
      if (data) setComments(data as any)
      setLoading(false)
    }
    fetchComments()
  }, [noteId, supabase])

  const handleSubmit = async () => {
    if (!userId) return alert('Please login to comment.')
    if (!newComment.trim()) return

    const tempComment = {
      id: Math.random().toString(),
      content: newComment,
      created_at: new Date().toISOString(),
      profiles: { full_name: 'You', avatar_url: '' }
    }

    setComments([tempComment, ...comments])
    setNewComment('')

    await supabase.from('comments').insert({
      content_item_id: noteId,
      user_id: userId,
      content: newComment
    })
  }

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-bold tracking-tight">Discussion ({comments.length})</h3>
      
      {userId ? (
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea 
              placeholder="Share your thoughts..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleSubmit}>Post Comment</Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground">
          Please login to join the discussion.
        </div>
      )}

      <div className="space-y-6 mt-8">
        {loading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.profiles?.avatar_url || ''} />
                <AvatarFallback>{comment.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">{comment.profiles?.full_name || 'Anonymous User'}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
