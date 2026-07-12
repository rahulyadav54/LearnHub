import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react'

export default async function MockTestDetailsPage({
  params
}: {
  params: Promise<{ testId: string }>
}) {
  const { testId } = await params
  const supabase = await createClient()

  // Fetch test details
  const { data: test, error } = await supabase
    .from('mock_tests')
    .select(`
      *,
      programs (name)
    `)
    .eq('id', testId)
    .single()

  if (error || !test) notFound()

  // Count questions
  const { count } = await supabase
    .from('mock_test_questions')
    .select('id', { count: 'exact', head: true })
    .eq('mock_test_id', testId)

  const totalQuestions = count || 0
  const totalMarks = totalQuestions * Number(test.positive_marks)

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Link href="/mock-tests">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Exams
        </Button>
      </Link>

      <div className="mb-8">
        <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{test.programs?.name}</div>
        <h1 className="text-4xl font-extrabold mb-4">{test.title}</h1>
        <p className="text-lg text-muted-foreground">{test.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-bold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Maximum Marks</span>
                <span className="font-bold">{totalMarks}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {test.duration_minutes} mins
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Marking Scheme</span>
                <div className="flex items-center gap-4 font-medium">
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> +{test.positive_marks}
                  </span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" /> -{test.negative_marks}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <AlertCircle className="w-5 h-5" /> Rules & Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>The timer will start immediately once you click &quot;Start Exam&quot;.</li>
                <li>Do not refresh the page or you will lose your progress.</li>
                <li>Unanswered questions will not attract negative marking.</li>
                <li>Your exam will auto-submit when the timer reaches zero.</li>
              </ul>
              
              <div className="mt-8">
                {totalQuestions > 0 ? (
                  <Link href={`/mock-tests/${testId}/take`} className="block w-full">
                    <Button size="lg" className="w-full text-lg h-14">
                      Start Exam Now
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="w-full text-lg h-14" disabled>
                    No Questions Added Yet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
