'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string
  const subject = formData.get('subject') as string

  await supabase.from('contact_messages').insert({
    name,
    email,
    subject,
    message,
  })

  redirect('/contact?success=true')
}
