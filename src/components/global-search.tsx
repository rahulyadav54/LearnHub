'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, FileText, GraduationCap, Building2, HelpCircle, History, TrendingUp, Loader2 } from 'lucide-react'
import { globalSearch, logSearchQuery, getRecentSearches, getPopularSearches, SearchResult } from '@/app/actions/search-actions'

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [recent, setRecent] = React.useState<string[]>([])
  const [popular, setPopular] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (open && recent.length === 0) {
      getRecentSearches().then(setRecent)
      getPopularSearches().then(setPopular)
    }
  }, [open, recent.length])

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === '') {
        setResults([])
        return
      }
      setIsLoading(true)
      try {
        const data = await globalSearch(query)
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (href: string) => {
    if (query.trim() !== '') {
      logSearchQuery(query)
    }
    setOpen(false)
    router.push(href)
  }

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() !== '' && results.length === 0) {
       logSearchQuery(query)
       setOpen(false)
       router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Note': return <FileText className="w-4 h-4 text-blue-500" />
      case 'Question Paper': return <HelpCircle className="w-4 h-4 text-orange-500" />
      case 'Subject': return <GraduationCap className="w-4 h-4 text-primary" />
      case 'University': return <Building2 className="w-4 h-4 text-purple-500" />
      case 'Blog': return <FileText className="w-4 h-4 text-green-500" />
      default: return <FileText className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border rounded-full hover:bg-muted/80 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search notes, questions, subjects...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 ml-4 px-1.5 py-0.5 text-[10px] font-mono border rounded bg-background">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <button onClick={() => setOpen(true)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-full max-w-2xl px-4">
            <Command 
              className="flex flex-col w-full overflow-hidden bg-background border rounded-xl shadow-2xl cmdk-command"
              shouldFilter={false} // We filter on the server
            >
              <div className="flex items-center px-4 border-b">
                <Search className="w-5 h-5 mr-3 text-muted-foreground" />
                <Command.Input 
                  autoFocus
                  placeholder="Search across all modules..."
                  value={query}
                  onValueChange={setQuery}
                  onKeyDown={handleSearchSubmit}
                  className="flex-1 h-14 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                {isLoading && <Loader2 className="w-5 h-5 ml-3 animate-spin text-muted-foreground" />}
                <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono text-muted-foreground border rounded bg-muted">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                {query.trim() === '' && !isLoading && (
                  <>
                    {recent.length > 0 && (
                      <Command.Group heading="Recent Searches" className="p-2 text-xs font-medium text-muted-foreground">
                        {recent.map(r => (
                          <Command.Item 
                            key={`recent-${r}`} 
                            onSelect={() => {
                              setQuery(r)
                            }}
                            className="flex items-center gap-3 px-3 py-3 mt-1 text-sm rounded-md cursor-pointer text-foreground hover:bg-muted aria-selected:bg-muted"
                          >
                            <History className="w-4 h-4 text-muted-foreground" />
                            {r}
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                    
                    <Command.Group heading="Trending" className="p-2 text-xs font-medium text-muted-foreground mt-2">
                       {popular.map(p => (
                          <Command.Item 
                            key={`pop-${p}`} 
                            onSelect={() => {
                              setQuery(p)
                            }}
                            className="flex items-center gap-3 px-3 py-3 mt-1 text-sm rounded-md cursor-pointer text-foreground hover:bg-muted aria-selected:bg-muted"
                          >
                            <TrendingUp className="w-4 h-4 text-primary" />
                            {p}
                          </Command.Item>
                        ))}
                    </Command.Group>
                  </>
                )}

                {query.trim() !== '' && results.length === 0 && !isLoading && (
                  <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                    No results found for &quot;{query}&quot;. <br/> Press <strong className="text-foreground">Enter</strong> to search deeply.
                  </Command.Empty>
                )}

                {results.length > 0 && (
                  <Command.Group heading="Search Results" className="p-2 text-xs font-medium text-muted-foreground">
                    {results.map((res) => (
                      <Command.Item
                        key={`${res.type}-${res.id}`}
                        value={`${res.title} ${res.subtitle || ''}`}
                        onSelect={() => handleSelect(res.href)}
                        className="flex items-center gap-3 px-3 py-3 mt-1 text-sm rounded-md cursor-pointer text-foreground hover:bg-muted aria-selected:bg-muted"
                      >
                        {getIcon(res.type)}
                        <div className="flex flex-col">
                          <span className="font-medium">{res.title}</span>
                          <span className="text-xs text-muted-foreground uppercase">{res.type} {res.subtitle ? `• ${res.subtitle}` : ''}</span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
              
              {query.trim() !== '' && results.length > 0 && (
                <div className="p-3 border-t bg-muted/30 text-center">
                  <button 
                    onClick={() => handleSelect(`/search?q=${encodeURIComponent(query)}`)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    See all results for &quot;{query}&quot;
                  </button>
                </div>
              )}
            </Command>
          </div>
        </div>
      )}
    </>
  )
}
