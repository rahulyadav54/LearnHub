import { createClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(
  bucket: 'images' | 'pdfs',
  file: File,
  folderPath: string = ''
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage Upload Error:', error)
      return { url: null, error: new Error(error.message) }
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: unknown) {
    return { url: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}
