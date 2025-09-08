"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChatGPTProjectModal } from "@/components/chatgpt-project-modal"
import {
  Plus,
  Search,
  Library,
  FolderPlus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit3,
  PanelLeftClose,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClassificationBadge } from "@/components/classification-badge"

interface ChatItem {
  id: string
  title: string
  timestamp: Date
  classification?: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
}

interface ProjectItem {
  id: string
  name: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  conversations: ChatItem[]
}

interface ChatGPTSidebarProps {
  onNewChat: () => void
  onNewProject: () => void
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  chats?: ChatItem[]
  onDeleteChat?: (chatId: string) => void
  onRenameChat?: (chatId: string, newTitle: string) => void
  onSetClassification?: (chatId: string, level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => void
  projects?: ProjectItem[]
  onCreateConversation?: (projectId: string) => void
  onProjectCreate?: (name: string, category: string) => void
  onToggleSidebar?: () => void
}

export function ChatGPTSidebar({ onNewChat, onNewProject, selectedChatId, onChatSelect, chats: externalChats, onDeleteChat, onRenameChat, onSetClassification, projects, onCreateConversation, onProjectCreate, onToggleSidebar }: ChatGPTSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [localChats, setLocalChats] = useState<ChatItem[]>([
    { id: "1", title: "Superset dashboard setup", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "2", title: "Make Git repo private", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "3", title: "Nasdaq impact from Forex", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
    { id: "4", title: "Bulk data import options", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) },
    { id: "5", title: "Persist MTS drawings Ubuntu", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
    { id: "6", title: "Response formatting guide", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    { id: "7", title: "Document enhancement research", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: "8", title: "Cane price inquiry Kenya", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: "9", title: "Fix git merge conflict", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
    { id: "10", title: "Sugar cane varieties Kenya", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96) },
    { id: "11", title: "Create and checkout branch", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120) },
    { id: "12", title: "Image resizing and background", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144) },
    { id: "13", title: "Explore sqlite db content", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168) },
    { id: "14", title: "Fix SQL syntax error", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 192) },
    { id: "15", title: "Install Neovim on Ubuntu", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 216) },
    { id: "16", title: "KSB insights with LangChain", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 240) },
    { id: "17", title: "Update VS Code", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 264) },
    { id: "18", title: "CORS error troubleshooting", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 288) },
  ])

  const chats = externalChats ?? localChats
  const [showProjectModal, setShowProjectModal] = useState(false)

  const filteredChats = chats.filter((chat: ChatItem) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteChat) {
      onDeleteChat(chatId)
    } else {
      setLocalChats((prev: ChatItem[]) => prev.filter((chat: ChatItem) => chat.id !== chatId))
    }
  }

  const handleProjectCreate = async (name: string, category: string) => {
    if (onProjectCreate) {
      await onProjectCreate(name, category)
    } else {
      console.log("Creating project:", { name, category })
      onNewProject()
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    const days = Math.floor(diffInHours / 24)
    if (days < 7) return `${days}d ago`
    const weeks = Math.floor(days / 7)
    return `${weeks}w ago`
  }

  return (
    <>
      <div className="flex h-full w-full flex-col bg-background border-r border-border text-foreground overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={onToggleSidebar}
                title="Hide sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-2 border-b border-border">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="h-8 w-full justify-start gap-2 px-2 text-[13px] text-foreground hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              New chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-foreground hover:bg-accent"
            >
              <Search className="h-4 w-4" />
              Search chats
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start gap-2 px-2 text-[13px] text-foreground hover:bg-accent"
            >
              <Library className="h-4 w-4" />
              Library
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProjectModal(true)}
              className="h-8 w-full justify-start gap-2 px-2 text-[13px] text-foreground hover:bg-accent"
            >
              <FolderPlus className="h-4 w-4" />
              New project
            </Button>
          </div>
        </div>

        {/* Projects */}
        <div className="border-b border-sidebar-border">
          <div className="p-2">
            <h3 className="px-2 py-1 text-[11px] font-medium tracking-wide uppercase text-muted-foreground">Projects</h3>
          </div>
          <ScrollArea className="sidebar-scroll max-h-60 px-2">
            <div className="space-y-1 pb-2">
              {(projects ?? []).map((p: ProjectItem) => (
                <div key={p.id}>
                  <ProjectRow
                    project={p}
                    selectedChatId={selectedChatId}
                    onChatSelect={onChatSelect}
                    onDeleteChat={onDeleteChat}
                    onRenameChat={onRenameChat}
                    onCreateConversation={onCreateConversation}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Standalone Chats */}
        <div className="flex-1 overflow-hidden">
          <div className="p-2">
            <h3 className="px-2 py-1 text-[11px] font-medium tracking-wide uppercase text-muted-foreground">Chats</h3>
          </div>
          <ScrollArea className="sidebar-scroll flex-1 px-2">
            <div className="space-y-1 pb-4">
              {filteredChats.map((chat: ChatItem) => (
                <div key={chat.id}>
                  <ChatItem
                    chat={chat}
                    isSelected={chat.id === selectedChatId}
                    onSelect={() => onChatSelect(chat.id)}
                    onDelete={(e: React.MouseEvent) => handleDeleteChat(chat.id, e)}
                    onRename={(newTitle) => onRenameChat?.(chat.id, newTitle)}
                    onSetClassification={(level) => onSetClassification?.(chat.id, level)}
                    formatTimeAgo={formatTimeAgo}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Profile */}
        <div className="mt-auto shrink-0 border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              C
            </div>
            <span className="text-sm">Chrisphine Shikuku</span>
          </Button>
          <div className="mt-1 px-2">
            <span className="text-xs text-muted-foreground">Free</span>
          </div>
        </div>
      </div>

      {/* ChatGPT-style project modal */}
      <ChatGPTProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        onProjectCreate={handleProjectCreate}
      />
    </>
  )
}

interface ChatItemProps {
  chat: ChatItem
  isSelected: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
  onRename?: (newTitle: string) => void
  onSetClassification?: (level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => void
  formatTimeAgo: (date: Date) => string
}

function ChatItem({ chat, isSelected, onSelect, onDelete, onRename, onSetClassification, formatTimeAgo }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-colors text-[13px]",
        isSelected
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate flex-1">{chat.title}</div>
          {chat.classification && (
            <ClassificationBadge level={chat.classification} className="text-[10px] px-1 py-0.5" />
          )}
        </div>
      </div>

      {(isHovered || isSelected) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                const newTitle = window.prompt("Rename conversation", chat.title)
                if (newTitle && newTitle.trim() && onRename) {
                  onRename(newTitle.trim())
                }
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onSetClassification?.("UNCLASSIFIED")
              }}
            >
              <span className="text-xs mr-2">•</span>
              Mark as UNCLASSIFIED
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onSetClassification?.("CONFIDENTIAL")
              }}
            >
              <span className="text-xs mr-2">•</span>
              Mark as CONFIDENTIAL
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onSetClassification?.("SECRET")
              }}
            >
              <span className="text-xs mr-2">•</span>
              Mark as SECRET
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

interface ProjectRowProps {
  project: ProjectItem
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  onDeleteChat?: (chatId: string) => void
  onRenameChat?: (chatId: string, newTitle: string) => void
  onCreateConversation?: (projectId: string) => void
}

function ProjectRow({ project, selectedChatId, onChatSelect, onDeleteChat, onRenameChat, onCreateConversation }: ProjectRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { id, name, classification, conversations } = project

  return (
    <div className="rounded-md">
      <div
        className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-sidebar-accent/50 rounded-md"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <div className="text-sm font-medium text-sidebar-foreground truncate max-w-[10rem]">{name}</div>
          <ClassificationBadge level={classification} className="text-[10px] px-1 py-0.5" />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onCreateConversation?.(id)
            }}
            title="New conversation"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="ml-4 space-y-1 pb-2">
          {conversations.length === 0 ? (
            <div className="border border-dashed border-sidebar-border rounded-md p-3 text-xs text-muted-foreground flex items-center justify-between">
              <span>No conversations in this project.</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 py-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateConversation?.(id)
                }}
              >
                + Chat
              </Button>
            </div>
          ) : (
            conversations.map((chat: ChatItem) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onSelect={() => onChatSelect(chat.id)}
                onDelete={(e) => {
                  e.stopPropagation()
                  onDeleteChat?.(chat.id)
                }}
                onRename={(newTitle) => onRenameChat?.(chat.id, newTitle)}
                onSetClassification={(level) => onSetClassification?.(chat.id, level)}
                formatTimeAgo={() => ""}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
