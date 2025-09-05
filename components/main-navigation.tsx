"use client"

import { Button } from "@/components/ui/button"
import { FolderOpen, FileText, MessageSquare } from "lucide-react"

interface MainNavigationProps {
  currentView: "projects" | "briefings" | "standalone"
  onNavigate: (view: "projects" | "briefings" | "standalone") => void
}

export function MainNavigation({ currentView, onNavigate }: MainNavigationProps) {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Military Analysis Canvas</h1>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant={currentView === "projects" ? "default" : "ghost"} onClick={() => onNavigate("projects")}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button variant={currentView === "standalone" ? "default" : "ghost"} onClick={() => onNavigate("standalone")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Standalone Chat
          </Button>
          <Button variant={currentView === "briefings" ? "default" : "ghost"} onClick={() => onNavigate("briefings")}>
            <FileText className="h-4 w-4 mr-2" />
            Intelligence Briefings
          </Button>
        </nav>
      </div>
    </div>
  )
}
