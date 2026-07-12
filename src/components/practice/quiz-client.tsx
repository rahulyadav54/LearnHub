/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Timer, ArrowRight, Loader2 } from 'lucide-react'
import { submitAttempt } from '@/app/actions/mcq-actions'
import { toast } from 'sonner'

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
}

interface QuizClientProps {
  subjectId: string
  questions: Question[]
}

export function QuizClient({ subjectId, questions }: QuizClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(questions.length * 60) // 1 minute per question
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const currentQ = questions[currentIndex]
  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    const timeTaken = (questions.length * 60) - timeLeft
    
    // Prepare data
    const formattedAnswers = questions.map(q => {
      const selected = answers[q.id] || null
      return {
        mcqId: q.id,
        selectedOption: selected,
        isCorrect: selected === q.correct_option
      }
    })

    try {
      const attemptId = await submitAttempt(subjectId, timeTaken, formattedAnswers)
      toast.success("Quiz submitted successfully!")
      router.push(`/practice/results/${attemptId}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to submit quiz. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Submitting your answers...</h2>
        <p className="text-muted-foreground mt-2">Computing your score and analyzing weak topics.</p>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
        <div>
          <CardTitle className="text-lg">Question {currentIndex + 1} of {questions.length}</CardTitle>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1 rounded-md ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <Timer className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 pb-8">
        <h2 className="text-2xl font-semibold mb-8">{currentQ.question}</h2>
        
        <RadioGroup 
          value={answers[currentQ.id] || ''} 
          onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQ.id]: val }))}
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
        <div className="text-sm text-muted-foreground">
          {Object.keys(answers).length} / {questions.length} Answered
        </div>
        <Button onClick={handleNext} className="gap-2">
          {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          {currentIndex !== questions.length - 1 && <ArrowRight className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
