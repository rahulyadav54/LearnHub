import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Clock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mock Tests & Online Practice Exams | HamroLearning Nepal',
  description: 'Take free online mock tests and practice exams for SEE, +2, Bachelors, TU, KU, CTEVT, and Loksewa. Simulate real exam environment with timers, negative marking, and competitive ranking.',
  keywords: ['mock tests Nepal', 'online practice exams Nepal', 'SEE mock test', '+2 mock test Nepal', 'Loksewa mock test', 'entrance exam practice', 'online quiz Nepal', 'test series Nepal', 'competitive exam practice'],
  openGraph: {
    title: 'Mock Tests & Practice Exams | HamroLearning Nepal',
    description: 'Practice with free online mock tests for SEE, +2, Bachelors, TU, KU, CTEVT, and Loksewa exams. Get instant results and competitive rankings.',
  },
  alternates: {
    canonical: '/mock-tests',
  },
}

export default async function MockTestsHub() {
  const supabase = await createClient()

  // Fetch published mock tests with their programs
  const { data: mockTests } = await supabase
    .from('mock_tests')
    .select(`
      *,
      programs (name)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Mock Tests & Entrance Exams
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Simulate the real exam environment with strict timers, negative marking, and competitive global ranking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests && mockTests.length > 0 ? (
          mockTests.map((test) => (
            <Card key={test.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="text-sm font-semibold text-primary mb-2">
                  {test.programs?.name}
                </div>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {test.description || 'Full syllabus mock test.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {test.duration_minutes} Minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    +{test.positive_marks} / -{test.negative_marks} Marking Scheme
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/mock-tests/${test.id}`} className="block w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-12 text-center border rounded-lg bg-muted/30">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No active mock tests</h3>
            <p className="text-muted-foreground">Check back later before exam season starts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
