"use client"

import type * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCategory {
  id: string
  name: string
  color: string
  bgColor: string
}

const categories: ProjectCategory[] = [
  { id: "investing", name: "Investing", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { id: "homework", name: "Homework", color: "text-blue-700", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "writing", name: "Writing", color: "text-purple-700", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "health", name: "Health", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/30" },
  { id: "analysis", name: "Analysis", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
]

interface ChatGPTProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreate: (name: string, category: string) => void
}

export function ChatGPTProjectModal({ open, onOpenChange, onProjectCreate }: ChatGPTProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setIsLoading(true)
    try {
      await onProjectCreate(projectName, selectedCategory || "analysis")
      setProjectName("")
      setSelectedCategory("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-background border-border">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">Project name</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Project Name Input */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Copenhagen Trip"
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      category.bgColor,
                      category.color,
                      selectedCategory === category.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                  >
                    <div className={cn("h-2 w-2 rounded-full", category.color.replace("text-", "bg-"))} />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Description Text */}
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just
                  to keep things tidy.
                </p>
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!projectName.trim() || isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Creating..." : "Create project"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
