"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClassificationBadge } from "./classification-badge"
import { MoreHorizontal, Trash2, FolderOpen } from "lucide-react"
import type { MilitaryProject } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

interface ProjectCardProps {
  project: MilitaryProject
  onSelect: (project: MilitaryProject) => void
  onDelete: (projectId: string) => void
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(project.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onSelect(project)}>
            <CardTitle className="text-lg font-semibold text-balance">{project.name}</CardTitle>
            <CardDescription className="mt-1 text-pretty">{project.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSelect(project)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Project"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <ClassificationBadge level={project.classification_level} />
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button onClick={() => onSelect(project)} className="w-full" variant="outline">
          <FolderOpen className="h-4 w-4 mr-2" />
          Open Project
        </Button>
      </CardFooter>
    </Card>
  )
}
