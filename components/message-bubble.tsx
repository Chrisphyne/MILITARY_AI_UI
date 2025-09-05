"use client"

import { ClassificationBadge } from "./classification-badge"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"
import type { MilitaryMessage } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: MilitaryMessage
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex gap-3 mb-6", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <div className={cn("flex items-center gap-2 mb-2", isUser && "flex-row-reverse")}>
          <span className="text-sm font-medium">{isUser ? "You" : "Military AI"}</span>
          <ClassificationBadge level={message.classification_level} />
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </Badge>
        </div>

        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm leading-relaxed",
            isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-card border text-card-foreground",
            isStreaming && "animate-pulse",
          )}
        >
          <div className="whitespace-pre-wrap text-pretty">
            {message.content}
            {isStreaming && <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />}
          </div>

          {isAssistant && message.metadata && (
        {isAssistant && message.message_metadata && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {message.metadata.analysis_type && (
              {message.message_metadata?.analysis_type && (
                    {message.metadata.analysis_type}
                  {message.message_metadata.analysis_type}
                )}
                {message.metadata.agents_used && message.metadata.agents_used.length > 0 && (
              {message.message_metadata?.agents_used && message.message_metadata.agents_used.length > 0 && (
                    Agents: {message.metadata.agents_used.join(", ")}
                  Agents: {message.message_metadata.agents_used.join(", ")}
                )}
                {message.metadata.source_urls && message.metadata.source_urls.length > 0 && (
              {message.message_metadata?.source_urls && message.message_metadata.source_urls.length > 0 && (
                    {message.metadata.source_urls.length} sources
                  {message.message_metadata.source_urls.length} sources
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
