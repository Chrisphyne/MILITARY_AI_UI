"use client"

import * as React from "react"
import { User, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatGPTMessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function ChatGPTMessageBubble({ message, isStreaming }: ChatGPTMessageBubbleProps) {
  const isUser = message.role === "user"
  const [showActions, setShowActions] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div className="group mb-6" onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="flex gap-4 max-w-4xl mx-auto px-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
              isUser ? "bg-primary" : "bg-green-600",
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <div className="text-xs font-bold">AI</div>}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-foreground leading-relaxed">
            <div className="whitespace-pre-wrap text-pretty">
              {message.content}
              {isStreaming && <span className="inline-block w-2 h-4 bg-foreground ml-1 animate-pulse" />}
            </div>
          </div>

          {/* Message Actions */}
          {!isUser && (showActions || isStreaming) && (
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
