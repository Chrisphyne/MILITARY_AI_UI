"use client"

import * as React from "react"
import { User, Copy, ThumbsUp, ThumbsDown, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  citations?: string[]
}

interface ChatGPTMessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function ChatGPTMessageBubble({ message, isStreaming }: ChatGPTMessageBubbleProps) {
  const isUser = message.role === "user"
  const [showActions, setShowActions] = React.useState(false)

  const citations = React.useMemo(() => Array.from(new Set(message.citations || [])), [message.citations])
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }
  const domain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "")
    } catch {
      return url
    }
  }

  return (
    <div className="group mb-6" onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="flex gap-4 max-w-3xl mx-auto px-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
              isUser ? "bg-primary" : "bg-foreground",
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-background" />}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="text-[15px] text-foreground leading-relaxed">
            {/* Inline citation chips (like ChatGPT) */}
            {!isUser && citations.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {citations.map((url, idx) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                    title={url}
                  >
                    [{idx + 1}]
                  </a>
                ))}
              </div>
            )}
            <div className="text-pretty prose prose-sm dark:prose-invert max-w-none">
              {isUser ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              )}
              {isStreaming && <span className="inline-block w-2 h-4 bg-foreground ml-1 animate-pulse align-middle" />}
            </div>

            {/* Sources footer list (deduped) */}
            {!isUser && citations.length > 0 && (
              <div className="mt-3 border-t border-border pt-2">
                <div className="text-xs font-medium text-muted-foreground mb-1">Sources</div>
                <ul className="space-y-1">
                  {citations.map((url, idx) => (
                    <li key={url} className="text-xs">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-muted-foreground hover:text-foreground"
                      >
                        [{idx + 1}] {domain(url)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
