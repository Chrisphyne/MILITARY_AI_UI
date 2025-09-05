"use client"

import type * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChatGPTProjectModal } from "@/components/chatgpt-project-modal"
import {
  Plus,
  Search,
  Library,
  Sparkles,
  Bot,
  FolderPlus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatItem {
  id: string
  title: string
  timestamp: Date
}

interface ChatGPTSidebarProps {
  onNewChat: () => void
  onNewProject: () => void
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
}

export function ChatGPTSidebar({ onNewChat, onNewProject, selectedChatId, onChatSelect }: ChatGPTSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState<ChatItem[]>([
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

  const [showProjectModal, setShowProjectModal] = useState(false)

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  const handleProjectCreate = async (name: string, category: string) => {
    // This would integrate with your project creation logic
    console.log("Creating project:", { name, category })
    onNewProject()
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
      <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="flex-1 justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent/50 border-0 text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-2 border-b border-sidebar-border">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Library className="h-4 w-4" />
              Library
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Sparkles className="h-4 w-4" />
              Sora
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Bot className="h-4 w-4" />
              GPTs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProjectModal(true)}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <FolderPlus className="h-4 w-4" />
              New project
            </Button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="p-2">
            <h3 className="px-2 py-1 text-xs font-medium text-muted-foreground">Chats</h3>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isSelected={chat.id === selectedChatId}
                  onSelect={() => onChatSelect(chat.id)}
                  onDelete={(e) => handleDeleteChat(chat.id, e)}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-3">
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
  formatTimeAgo: (date: Date) => string
}

function ChatItem({ chat, isSelected, onSelect, onDelete, formatTimeAgo }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg p-2 cursor-pointer transition-colors",
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
        <div className="text-sm font-medium truncate">{chat.title}</div>
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
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
