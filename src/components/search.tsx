"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function SearchCommand() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search courses, notes, past questions..."
        className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-full"
      />
    </div>
  )
}
