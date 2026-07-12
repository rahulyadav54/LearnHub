'use server'

import { createClient } from '@/utils/supabase/server'

export async function syncReadingProgress(contentItemId: string, currentPage: number, totalPages: number) {
  if (totalPages === 0) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const progress = (currentPage / totalPages) * 100

  await supabase
    .from('reading_history')
    .upsert({
      user_id: user.id,
      content_item_id: contentItemId,
      current_page: currentPage,
      total_pages: totalPages,
      progress_percentage: progress,
      last_read_at: new Date().toISOString()
    }, { onConflict: 'user_id,content_item_id' })
}
