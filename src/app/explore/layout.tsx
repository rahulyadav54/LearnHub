import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Resources | HamroLearning Nepal',
  description: 'Browse free study notes, question papers, mock tests, scholarships, and academic resources for SEE, +2, Bachelors, Masters, TU, KU, CTEVT, and Loksewa students.',
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  )
}
