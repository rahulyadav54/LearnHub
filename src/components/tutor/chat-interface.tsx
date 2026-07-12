'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles, BookOpen, Languages, Calculator, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createChatSession } from '@/app/actions/chat-actions'

interface ChatInterfaceProps {
  initialSessionId?: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  initialMessages: any[]
}

const TEMPLATES = [
  { icon: Sparkles, label: 'Explain this simply', prompt: 'Explain the following topic simply, as if I were a high school student: ' },
  { icon: Languages, label: 'Explain in Nepali', prompt: 'Explain the following concept entirely in Nepali language (using Romanized Nepali or Devanagari): ' },
  { icon: ListTodo, label: 'Generate MCQs', prompt: 'Generate 5 multiple choice questions with answers on the following topic: ' },
  { icon: Calculator, label: 'Give Examples', prompt: 'Provide 3 real-world, practical examples of this concept: ' },
  { icon: BookOpen, label: 'Study Planner', prompt: 'Create a 1-week study planner for the following subject: ' },
]

export function ChatInterface({ initialSessionId, initialMessages }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    // @ts-expect-error vercel-ai-sdk-v4-type-drift
    api: '/api/chat',
    body: { sessionId },
    initialMessages: initialMessages.map(m => ({ id: m.id, role: m.role, content: m.content }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!sessionId) {
      try {
        const title = input.slice(0, 30) + (input.length > 30 ? '...' : '')
        const session = await createChatSession(title)
        setSessionId(session.id)
        window.history.pushState({}, '', `/tutor?session=${session.id}`)
      } catch (err) {
        console.error("Failed to create session", err)
      }
    }
    handleSubmit(e)
  }

  const handleTemplateClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-full bg-muted/10 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Your Personal AI Tutor</h1>
            <p className="text-muted-foreground max-w-md">
              Ask questions, generate flashcards, practice MCQs, or get topics explained in English or Nepali.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
              {TEMPLATES.map(t => (
                <Button key={t.label} variant="outline" size="sm" onClick={() => handleTemplateClick(t.prompt)} className="rounded-full">
                  <t.icon className="w-4 h-4 mr-2 text-primary" />
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m: { id: string, role: string, content: string }) => (
            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-background border rounded-tl-sm shadow-sm'}`}>
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={onSubmit} className="relative flex items-center">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask the AI Tutor anything..."
              className="w-full rounded-full pl-6 pr-12 py-6 shadow-lg border-primary/20 focus-visible:ring-primary/30 text-base"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 rounded-full w-10 h-10 shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-3">
            <span className="text-xs text-muted-foreground">AI can make mistakes. Verify important academic information before exams.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
