"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { militaryAPI, type MilitaryConversation, type MilitaryProject } from "@/lib/api"

interface CreateConversationDialogProps {
  project: MilitaryProject | null
  onConversationCreated: (conversation: MilitaryConversation) => void
  trigger?: React.ReactNode
}

export function CreateConversationDialog({ project, onConversationCreated, trigger }: CreateConversationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    is_standalone: !project,
    classification_level: (project?.classification_level || "UNCLASSIFIED") as
      | "UNCLASSIFIED"
      | "CONFIDENTIAL"
      | "SECRET",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsLoading(true)
    try {
      const conversation = await militaryAPI.createConversation({
        project_id: formData.is_standalone ? undefined : project?.id,
        title: formData.title,
        is_standalone: formData.is_standalone,
        classification_level: formData.classification_level,
      })
      onConversationCreated(conversation)
      setFormData({
        title: "",
        is_standalone: !project,
        classification_level: project?.classification_level || "UNCLASSIFIED",
      })
      setOpen(false)
    } catch (error) {
      console.error("Failed to create conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Conversation</DialogTitle>
            <DialogDescription>
              Start a new military analysis conversation {project ? `in ${project.name}` : "as standalone"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Conversation Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Unit Readiness Assessment"
                required
              />
            </div>
            {!project && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="standalone"
                  checked={formData.is_standalone}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_standalone: !!checked })}
                />
                <Label htmlFor="standalone" className="text-sm">
                  Create as standalone conversation
                </Label>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="classification">Classification Level</Label>
              <Select
                value={formData.classification_level}
                onValueChange={(value: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") =>
                  setFormData({ ...formData, classification_level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNCLASSIFIED">UNCLASSIFIED</SelectItem>
                  <SelectItem value="CONFIDENTIAL">CONFIDENTIAL</SelectItem>
                  <SelectItem value="SECRET">SECRET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Creating..." : "Create Conversation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
