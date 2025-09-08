"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search, PanelLeftOpen } from "lucide-react"

interface MiniRailProps {
  onOpenSidebar: () => void
  onNewChat: () => void
}

export function MiniRail({ onOpenSidebar, onNewChat }: MiniRailProps) {
  return (
    <div className="fixed left-0 top-0 z-20 h-screen w-12 bg-background/95 border-r border-border flex flex-col items-center py-2 gap-2">
      {/* Open sidebar */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        onClick={onOpenSidebar}
        title="Open menu"
      >
        <PanelLeftOpen className="h-4 w-4" />
      </Button>

      {/* New chat */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        onClick={onNewChat}
        title="New chat"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Search */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        title="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <div className="mt-auto pb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          C
        </div>
      </div>
    </div>
  )
}
