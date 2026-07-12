export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  )
}
