"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { militaryAPI, type MilitaryConversation } from "@/lib/api"
import {
  Plus,
  Search,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit3,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatGPTSidebarProps {
  onNewChat: () => void
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  isCollapsed?: boolean
  onToggleCollapse: () => void
}

export function ChatGPTSidebar({ onNewChat, selectedChatId, onChatSelect, isCollapsed = false, onToggleCollapse }: ChatGPTSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<MilitaryConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const conversationsData = await militaryAPI.getConversations(undefined, true) // Get standalone conversations
      setConversations(conversationsData)
    } catch (error) {
      console.error("Failed to load conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conversation) => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await militaryAPI.deleteConversation(chatId)
      setConversations((prev) => prev.filter((conversation) => conversation.id !== chatId))
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }
  }

  const handleNewChat = async () => {
    try {
      const newConversation = await militaryAPI.createConversation({
        title: "New Chat",
        is_standalone: true,
        classification_level: "UNCLASSIFIED"
      })
      setConversations((prev) => [newConversation, ...prev])
      onChatSelect(newConversation.id)
      onNewChat()
    } catch (error) {
      console.error("Failed to create conversation:", error)
      onNewChat() // Fallback to existing behavior
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
      <div className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
        isCollapsed ? "w-12" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
          {!isCollapsed ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="flex-1 justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Plus className="h-4 w-4" />
                New chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <>
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
          </>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-medium text-muted-foreground">Chats</h3>
            </div>
          )}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  {isCollapsed ? "..." : "Loading..."}
                </div>
              ) : filteredConversations.length === 0 ? (
                !isCollapsed && (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No conversations yet
                  </div>
                )
              ) : (
                filteredConversations.map((conversation) => (
                  <ChatItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={conversation.id === selectedChatId}
                    onSelect={() => onChatSelect(conversation.id)}
                    onDelete={(e) => handleDeleteChat(conversation.id, e)}
                    formatTimeAgo={formatTimeAgo}
                    isCollapsed={isCollapsed}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                U
              </div>
              <span className="text-sm">User</span>
            </Button>
          </div>
        )}
      </div>
  )
}

interface ChatItemProps {
  conversation: MilitaryConversation
  isSelected: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
  formatTimeAgo: (date: Date) => string
  isCollapsed: boolean
}

function ChatItem({ conversation, isSelected, onSelect, onDelete, formatTimeAgo, isCollapsed }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (isCollapsed) {
    return (
      <div
        className={cn(
          "group relative flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors",
          isSelected
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
        )}
        onClick={onSelect}
        title={conversation.title}
      >
        <MessageSquare className="h-4 w-4" />
      </div>
    )
  }

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
        <div className="text-sm font-medium truncate">{conversation.title}</div>
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
