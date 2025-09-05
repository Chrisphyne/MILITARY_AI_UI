"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClassificationBadge } from "./classification-badge"
import { Plus, MessageSquare, MoreHorizontal, Trash2, ArrowLeft } from "lucide-react"
import { militaryAPI, type MilitaryConversation, type MilitaryProject } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ConversationSidebarProps {
  project: MilitaryProject | null
  selectedConversationId: string | null
  onConversationSelect: (conversation: MilitaryConversation) => void
  onNewConversation: () => void
  onBackToProjects: () => void
}

export function ConversationSidebar({
  project,
  selectedConversationId,
  onConversationSelect,
  onNewConversation,
  onBackToProjects,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<MilitaryConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [project])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const conversationsData = await militaryAPI.getConversations(project?.id)
      setConversations(conversationsData)
    } catch (error) {
      console.error("Failed to load conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await militaryAPI.deleteConversation(conversationId)
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }
  }

  const addConversation = (conversation: MilitaryConversation) => {
    setConversations((prev) => [conversation, ...prev])
  }

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="ghost" size="sm" onClick={onBackToProjects}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-balance">{project ? project.name : "Standalone Conversations"}</h2>
            {project && <ClassificationBadge level={project.classification_level} className="mt-1" />}
          </div>
        </div>
        <Button onClick={onNewConversation} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Create your first conversation to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={conversation.id === selectedConversationId}
                  onSelect={() => onConversationSelect(conversation)}
                  onDelete={() => handleDeleteConversation(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ConversationItemProps {
  conversation: MilitaryConversation
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function ConversationItem({ conversation, isSelected, onSelect, onDelete }: ConversationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
        isSelected && "bg-accent",
      )}
      onClick={onSelect}
    >
      <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-balance">{conversation.title}</div>
        <div className="flex items-center gap-2 mt-1">
          <ClassificationBadge level={conversation.classification_level} className="text-xs" />
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
          </Badge>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
