/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Timer, ArrowLeft, ArrowRight, Loader2, LayoutGrid } from 'lucide-react'
import { submitMockAttempt } from '@/app/actions/mock-actions'
import { toast } from 'sonner'

interface Question {
  mockTestQuestionId: string
  mcqId: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

interface ExamClientProps {
  testId: string
  testTitle: string
  durationMinutes: number
  questions: Question[]
}

export function ExamClient({ testId, testTitle, durationMinutes, questions }: ExamClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  const currentQ = questions[currentIndex]

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    const timeTaken = (durationMinutes * 60) - timeLeft
    
    const formattedAnswers = questions.map(q => {
      const selected = answers[q.mockTestQuestionId] || null
      return {
        mockTestQuestionId: q.mockTestQuestionId,
        mcqId: q.mcqId,
        selectedOption: selected,
        isCorrect: false // Server will evaluate this securely!
      }
    })

    try {
      const attemptId = await submitMockAttempt(testId, timeTaken, formattedAnswers)
      toast.success("Exam submitted successfully!")
      router.push(`/mock-tests/results/${attemptId}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to submit exam.")
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Submitting Exam...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we calculate your score and rank.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main Question Area */}
      <div className="flex-1">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-muted/30">
            <div>
              <CardTitle className="text-xl">{testTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-md ${timeLeft < 300 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'}`}>
              <Timer className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
          </CardHeader>
          
          <CardContent className="pt-8 pb-12 min-h-[400px]">
            <h2 className="text-2xl font-semibold mb-8">{currentQ.question}</h2>
            
            <RadioGroup 
              value={answers[currentQ.mockTestQuestionId] || ''} 
              onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQ.mockTestQuestionId]: val }))}
              className="space-y-4"
            >
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                  <RadioGroupItem value={opt} id={`opt-${opt}`} />
                  <Label htmlFor={`opt-${opt}`} className="flex-1 cursor-pointer text-base">
                    {currentQ[`option_${opt}` as keyof typeof currentQ]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-muted/10 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowGrid(!showGrid)} className="md:hidden">
                <LayoutGrid className="w-4 h-4 mr-2" /> Jump
              </Button>
              {currentIndex === questions.length - 1 ? (
                <Button onClick={handleComplete} variant="destructive">
                  Submit Exam
                </Button>
              ) : (
                <Button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Question Grid Sidebar */}
      <div className={`md:w-72 ${showGrid ? 'block' : 'hidden md:block'}`}>
        <Card className="sticky top-6">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg">Question Palette</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.mockTestQuestionId]
                const isCurrent = idx === currentIndex
                
                let btnClass = "border-border"
                if (isCurrent) btnClass = "border-primary ring-2 ring-primary ring-offset-1"
                else if (isAnswered) btnClass = "bg-primary text-primary-foreground border-primary"
                
                return (
                  <button
                    key={q.mockTestQuestionId}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 w-10 rounded border font-medium flex items-center justify-center transition-all ${btnClass} hover:opacity-80`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            
            <div className="mt-8 space-y-2 text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-border"></div> Not Answered
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button onClick={handleComplete} variant="destructive" className="w-full">
                Submit Exam Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
