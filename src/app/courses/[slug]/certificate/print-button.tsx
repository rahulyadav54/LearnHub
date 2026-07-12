'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function CertificatePrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-5 gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10 cursor-pointer"
    >
      <Printer className="w-4 h-4" /> Print Certificate
    </Button>
  )
}
