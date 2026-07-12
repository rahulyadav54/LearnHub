/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'

export default async function NotesAdminPage() {
  const supabase = await createClient()
  const { data: notes } = await supabase
    .from('content_items')
    .select('*, subjects(name)')
    .eq('content_type', 'note')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Manage study notes and uploaded PDFs.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>File Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.title}</TableCell>
                  <TableCell>
                    {(note.subjects as any)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {note.file_url ? (
                      <Badge variant="secondary">PDF Attached</Badge>
                    ) : (
                      <Badge variant="destructive">Missing File</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-primary cursor-pointer hover:underline">
                    Edit / Upload PDF
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
