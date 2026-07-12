export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto flex flex-col gap-4 py-8 md:flex-row md:items-center px-4">
        <div className="flex-1">
          <p className="text-center md:text-left text-sm leading-loose text-muted-foreground">
            Built for Nepal&apos;s educational ecosystem. SEE, +2, Bachelors, and beyond.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HamroLearning Nepal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
