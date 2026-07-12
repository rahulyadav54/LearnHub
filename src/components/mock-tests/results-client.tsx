/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Clock, Target, AlertCircle, ArrowLeft, Download, CheckCircle2, XCircle, FileWarning, Sparkles, Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getAiMockAnalysis } from '@/app/actions/mock-actions'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Answer {
  id: string
  isCorrect: boolean
  selectedOption: string | null
  marksAwarded: number
  question: string
  correctOption: string
  explanation: string
  options: { a: string; b: string; c: string; d: string }
}

interface ResultsClientProps {
  attemptId: string
  testTitle: string
  score: number
  timeTaken: number
  rank: number
  totalQuestions: number
  correctCount: number
  wrongCount: number
  skippedCount: number
  chartData: any[]
  answers: Answer[]
  positiveMarks: number
  negativeMarks: number
}

export function ResultsClient(props: ResultsClientProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleGetAiAnalysis = async () => {
    setIsAiLoading(true)
    try {
      const result = await getAiMockAnalysis(props.attemptId)
      setAiAnalysis(result)
    } catch {
      toast.error("Failed to generate AI analysis.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return
    const toastId = toast.loading("Generating Certificate...")
    
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`Certificate_${props.testTitle.replace(/\s+/g, '_')}.pdf`)
      
      toast.success("Certificate downloaded successfully!", { id: toastId })
    } catch {
      toast.error("Failed to generate certificate.", { id: toastId })
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  const maxScore = props.totalQuestions * props.positiveMarks
  const percentage = Math.round((props.score / maxScore) * 100)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/mock-tests">
            <Button variant="ghost" className="mb-2 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Mock Tests
            </Button>
          </Link>
          <h1 className="text-3xl font-extrabold">{props.testTitle} Results</h1>
        </div>
        <Button onClick={handleDownloadCertificate} className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white">
          <Download className="w-4 h-4" /> Download Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Total Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-primary">{props.score}</span>
              <span className="text-lg text-muted-foreground">/ {maxScore}</span>
            </div>
            <p className="text-sm text-primary mt-1 font-medium">{percentage}% Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" /> Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground">#{props.rank}</div>
            <p className="text-sm text-muted-foreground mt-1">Keep practicing to improve!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" /> Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground">
              {props.correctCount > 0 ? Math.round((props.correctCount / (props.correctCount + props.wrongCount)) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground mt-1 text-red-500 font-medium">
              -{props.wrongCount * props.negativeMarks} negative marks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Time Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{formatTime(props.timeTaken)}</div>
            <p className="text-sm text-muted-foreground mt-1">Avg {Math.round(props.timeTaken / props.totalQuestions)}s per question</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={props.chartData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell key="cell-0" fill="#22c55e" />
                  <Cell key="cell-1" fill="#ef4444" />
                  <Cell key="cell-2" fill="#94a3b8" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" /> AI Study Suggestions
            </CardTitle>
            <CardDescription>Get personalized advice based on your mistakes.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {aiAnalysis ? (
              <div className="text-left text-sm text-foreground leading-relaxed whitespace-pre-wrap w-full bg-purple-500/5 p-4 rounded-lg border border-purple-500/20">
                {aiAnalysis}
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Our AI tutor can analyze your incorrect and skipped questions to generate a custom revision plan specifically for you.
                </p>
                <Button onClick={handleGetAiAnalysis} disabled={isAiLoading} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAiLoading ? "Analyzing Performance..." : "Generate AI Analysis"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold pt-8">Detailed Answer Review</h2>
      <div className="space-y-6 pb-12">
        {props.answers.map((answer, index) => {
          let stateIcon = <FileWarning className="w-6 h-6 text-slate-400" />
          let stateClass = "border-l-slate-400"
          
          if (answer.isCorrect) {
            stateIcon = <CheckCircle2 className="w-6 h-6 text-green-500" />
            stateClass = "border-l-green-500"
          } else if (answer.selectedOption) {
            stateIcon = <XCircle className="w-6 h-6 text-red-500" />
            stateClass = "border-l-red-500"
          }

          return (
            <Card key={answer.id} className={`border-l-4 ${stateClass}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{stateIcon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <span className="font-mono font-bold text-sm bg-muted px-2 py-1 rounded">
                        Marks: {answer.marksAwarded > 0 ? '+' : ''}{answer.marksAwarded}
                      </span>
                    </div>
                    <CardDescription className="text-base text-foreground font-medium">
                      {answer.question}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-10">
                <div className="space-y-2 mt-2">
                  {['a', 'b', 'c', 'd'].map(opt => {
                    const isSelected = answer.selectedOption === opt
                    const isActualCorrect = answer.correctOption === opt
                    
                    let bgClass = "bg-muted/20"
                    let borderClass = "border-transparent"
                    
                    if (isActualCorrect) {
                      bgClass = "bg-green-500/10"
                      borderClass = "border-green-500/50"
                    } else if (isSelected && !answer.isCorrect) {
                      bgClass = "bg-red-500/10"
                      borderClass = "border-red-500/50"
                    }

                    return (
                      <div key={opt} className={`p-3 rounded-md border ${bgClass} ${borderClass} flex items-center justify-between text-sm`}>
                        <div>
                          <span className="font-bold uppercase mr-3 opacity-50">{opt}.</span>
                          {answer.options[opt as keyof typeof answer.options]}
                        </div>
                        {isActualCorrect && <span className="text-xs font-bold text-green-600 dark:text-green-400">CORRECT</span>}
                        {isSelected && !answer.isCorrect && <span className="text-xs font-bold text-red-600 dark:text-red-400">YOURS</span>}
                      </div>
                    )
                  })}
                </div>

                {answer.explanation && (
                  <div className="mt-4 p-4 rounded-md bg-primary/5 text-sm border border-primary/10">
                    <strong>Explanation:</strong> {answer.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Hidden Certificate Node for html2canvas */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        <div ref={certificateRef} className="w-[1123px] h-[794px] bg-white text-slate-900 flex flex-col items-center justify-center p-20 border-[20px] border-double border-primary/20 relative">
          <div className="absolute top-10 left-10 text-primary opacity-20">
            <Trophy className="w-32 h-32" />
          </div>
          <h1 className="text-6xl font-serif font-bold text-primary mb-4 text-center">CERTIFICATE OF COMPLETION</h1>
          <h2 className="text-3xl text-slate-600 mb-12 text-center uppercase tracking-widest">HamroLearning Mock Test Platform</h2>
          
          <p className="text-2xl text-slate-500 mb-4 text-center">This certifies that</p>
          <div className="text-5xl font-bold mb-8 pb-4 border-b-2 border-slate-300 min-w-[500px] text-center">
            Superstar Learner
          </div>
          
          <p className="text-xl text-slate-500 mb-8 text-center max-w-2xl leading-relaxed">
            Has successfully completed the <strong>{props.testTitle}</strong> exam with a remarkable score of <strong>{props.score}</strong>, achieving Rank <strong>#{props.rank}</strong> globally.
          </p>
          
          <div className="flex gap-24 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold border-b-2 border-primary pb-2 mb-2 w-48">{percentage}%</div>
              <p className="text-slate-500 uppercase tracking-widest text-sm">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold border-b-2 border-primary pb-2 mb-2 w-48">{new Date().toLocaleDateString()}</div>
              <p className="text-slate-500 uppercase tracking-widest text-sm">Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
