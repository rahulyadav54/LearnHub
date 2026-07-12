/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, FileText, BookOpen, BrainCircuit, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SubjectHubPage({ 
  params 
}: { 
  params: Promise<{ category: string, program: string, semester: string, subject: string }> 
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: subject } = await supabase
    .from('subjects')
    .select('*, programs(name), semesters(name)')
    .eq('slug', resolvedParams.subject)
    .single()

  if (!subject) return notFound()

  // Fetch all related content in parallel
  const [
    { data: notes },
    { data: papers },
    { data: books },
    { data: mcqs }
  ] = await Promise.all([
    supabase.from('content_items').select('*').eq('subject_id', subject.id).eq('content_type', 'note').order('created_at', { ascending: false }),
    supabase.from('content_items').select('*').eq('subject_id', subject.id).eq('content_type', 'question_paper').order('created_at', { ascending: false }),
    supabase.from('books').select('*').eq('subject_id', subject.id),
    supabase.from('mcqs').select('*').eq('subject_id', subject.id)
  ])

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/explore" className="hover:text-primary">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/explore/${resolvedParams.category}`} className="hover:text-primary">{resolvedParams.category}</Link>
          
          {resolvedParams.program !== 'none' && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/explore/${resolvedParams.category}/${resolvedParams.program}`} className="hover:text-primary">
                {(subject.programs as any)?.name || resolvedParams.program}
              </Link>
            </>
          )}

          {resolvedParams.semester !== 'none' && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">
                {(subject.semesters as any)?.name || resolvedParams.semester}
              </span>
            </>
          )}

          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{subject.name}</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
        <p className="mt-2 text-muted-foreground">Comprehensive study hub for {subject.name}</p>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="syllabus" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Official Syllabus</CardTitle>
              <CardDescription>The complete curriculum for this subject.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {subject.syllabus_content ? (
                  <div dangerouslySetInnerHTML={{ __html: subject.syllabus_content }} />
                ) : (
                  <p className="text-muted-foreground italic">Syllabus content has not been uploaded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="mt-6 space-y-8">
          {/* Notes Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Study Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes && notes.length > 0 ? notes.map(note => (
                <Card key={note.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.description}</p>
                    {note.file_url && (
                      <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No notes available yet.
                </div>
              )}
            </div>
          </div>

          {/* Books Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary"/> Recommended Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books && books.length > 0 ? books.map(book => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <CardDescription>By {book.author}</CardDescription>
                  </CardHeader>
                </Card>
              )) : (
                <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No books recommended yet.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="mt-6 space-y-8">
          {/* Past Papers */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Past Question Papers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers && papers.length > 0 ? papers.map(paper => (
                <Card key={paper.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{paper.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paper.file_url && (
                      <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No past papers available yet.
                </div>
              )}
            </div>
          </div>

          {/* MCQs */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary"/> Interactive MCQs</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <BrainCircuit className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                  <h4 className="text-lg font-semibold">AI Quiz Engine</h4>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    {mcqs && mcqs.length > 0 
                      ? `We have ${mcqs.length} multiple choice questions ready for you to practice.` 
                      : "The AI is currently generating practice questions for this subject."}
                  </p>
                  <Button className="mt-6" disabled={!mcqs || mcqs.length === 0}>
                    Start Practice Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
