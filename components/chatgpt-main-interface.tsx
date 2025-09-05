"use client"

import type * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatGPTMessageBubble } from "@/components/chatgpt-message-bubble"
import { Mic, ArrowUp, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatGPTMainInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  selectedChatId?: string
  isStreaming?: boolean
}

export function ChatGPTMainInterface({
  messages,
  onSendMessage,
  selectedChatId,
  isStreaming,
}: ChatGPTMainInterfaceProps) {
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isStreaming) return

    onSendMessage(message)
    setMessage("")
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
  }

  // Show chat interface if a chat is selected
  if (selectedChatId && messages.length > 0) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Messages */}
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="py-8">
            {messages.map((msg) => (
              <ChatGPTMessageBubble
                key={msg.id}
                message={msg}
                isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === "assistant"}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message ChatGPT"
                  disabled={isStreaming}
                  className="pr-20 py-3 bg-input border-border text-foreground placeholder:text-muted-foreground rounded-3xl"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={cn(
                      "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
                      isListening && "text-primary",
                    )}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  {message.trim() && !isStreaming && (
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Show welcome screen when no chat is selected or no messages
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header with upgrade button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">ChatGPT</h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Button>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4">
          Upgrade your plan
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-balance">What's on your mind today?</h2>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything"
                disabled={isStreaming}
                className="w-full py-4 pl-6 pr-20 bg-input border-border text-foreground placeholder:text-muted-foreground rounded-3xl text-base"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={cn(
                    "h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-full",
                    isListening && "text-primary bg-primary/10",
                  )}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <div className="h-4 w-4 flex items-center justify-center">
                    <div className="h-2 w-2 bg-current rounded-full" />
                    <div className="h-3 w-3 border border-current rounded-full ml-1" />
                  </div>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
