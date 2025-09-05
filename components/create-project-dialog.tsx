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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { militaryAPI, type MilitaryProject } from "@/lib/api"

interface CreateProjectDialogProps {
  onProjectCreated: (project: MilitaryProject) => void
}

export function CreateProjectDialog({ onProjectCreated }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classification_level: "UNCLASSIFIED" as "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) return

    setIsLoading(true)
    try {
      const project = await militaryAPI.createProject(formData)
      onProjectCreated(project)
      setFormData({ name: "", description: "", classification_level: "UNCLASSIFIED" })
      setOpen(false)
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Military Project</DialogTitle>
            <DialogDescription>
              Create a new military analysis project to organize your intelligence work.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Defense Budget Analysis 2024"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive analysis of defense budget allocation and spending patterns..."
                rows={3}
                required
              />
            </div>
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
            <Button type="submit" disabled={isLoading || !formData.name.trim() || !formData.description.trim()}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
