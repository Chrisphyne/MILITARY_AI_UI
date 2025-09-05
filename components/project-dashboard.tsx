"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { militaryAPI, type MilitaryProject } from "@/lib/api"

interface ProjectDashboardProps {
  onProjectSelect: (project: MilitaryProject) => void
}

export function ProjectDashboard({ onProjectSelect }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<MilitaryProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<MilitaryProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [classificationFilter, setClassificationFilter] = useState<string>("all")

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, classificationFilter])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const projectsData = await militaryAPI.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (classificationFilter !== "all") {
      filtered = filtered.filter((project) => project.classification_level === classificationFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleProjectCreated = (newProject: MilitaryProject) => {
    setProjects((prev) => [newProject, ...prev])
  }

  const handleProjectDelete = async (projectId: string) => {
    try {
      await militaryAPI.deleteProject(projectId)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Military Projects</h1>
          <p className="text-muted-foreground text-pretty">Manage and organize your military analysis projects</p>
        </div>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={classificationFilter} onValueChange={setClassificationFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            <SelectItem value="UNCLASSIFIED">UNCLASSIFIED</SelectItem>
            <SelectItem value="CONFIDENTIAL">CONFIDENTIAL</SelectItem>
            <SelectItem value="SECRET">SECRET</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {projects.length === 0
              ? "No projects found. Create your first project to get started."
              : "No projects match your search criteria."}
          </div>
          {projects.length === 0 && <CreateProjectDialog onProjectCreated={handleProjectCreated} />}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onProjectSelect} onDelete={handleProjectDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
