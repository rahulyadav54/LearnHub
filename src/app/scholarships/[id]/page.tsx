/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Metadata } from 'next'
import { Calendar, Building2, MapPin, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { checkScholarshipBookmark } from '@/app/actions/scholarship-actions'
import { ScholarshipBookmarkButton } from '@/components/scholarships/bookmark-button'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('scholarships')
    .select('title, provider, description')
    .eq('id', resolvedParams.id)
    .single()

  if (!data) return { title: 'Not Found' }

  return {
    title: `${data.title} | HamroLearning Scholarships`,
    description: data.description,
  }
}

export default async function SingleScholarshipPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: scholarship } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!scholarship) notFound()

  const isBookmarked = await checkScholarshipBookmark(scholarship.id)
  
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null
  const isExpired = deadline ? deadline < new Date() : false

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Banner */}
      <div className="bg-primary/5 border-b py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground px-3 py-1 rounded-full">
                  {scholarship.scholarship_type || 'General'}
                </span>
                {isExpired && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-destructive/10 text-destructive px-3 py-1 rounded-full">
                    Expired
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{scholarship.title}</h1>
              <div className="text-xl text-muted-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Offered by {scholarship.provider}
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
               <ScholarshipBookmarkButton scholarshipId={scholarship.id} initialBookmarked={isBookmarked} />
               {scholarship.link_url && (
                 <a href={scholarship.link_url} target="_blank" rel="noreferrer">
                   <Button size="lg" disabled={isExpired} className="gap-2">
                     {isExpired ? 'Applications Closed' : 'Apply Online'} <ExternalLink className="w-4 h-4" />
                   </Button>
                 </a>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About this Scholarship</h2>
            <div className="prose dark:prose-invert">
              <ReactMarkdown>{scholarship.description || 'No detailed description provided.'}</ReactMarkdown>
            </div>
          </section>
          
          {/* Eligibility */}
          {scholarship.eligibility_criteria && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Eligibility Criteria</h2>
              <div className="prose dark:prose-invert bg-muted/30 p-6 rounded-lg border border-border/50">
                <ReactMarkdown>{scholarship.eligibility_criteria}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Documents */}
          {scholarship.required_documents && scholarship.required_documents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Required Documents</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scholarship.required_documents.map((doc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-muted/10 p-4 rounded-lg border">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              
              {scholarship.amount && (
                <div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Grant Amount</div>
                  <div className="text-2xl font-extrabold text-green-600 dark:text-green-500">{scholarship.amount}</div>
                </div>
              )}

              {deadline && (
                <div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Application Deadline</div>
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <Calendar className="w-5 h-5" /> {deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {isExpired ? (
                     <div className="text-sm text-destructive font-medium mt-1">This scholarship has expired.</div>
                  ) : (
                     <div className="text-sm text-muted-foreground mt-1">Don&apos;t wait until the last minute!</div>
                  )}
                </div>
              )}
              
            </CardContent>
          </Card>
        </aside>

      </div>
    </div>
  )
}
