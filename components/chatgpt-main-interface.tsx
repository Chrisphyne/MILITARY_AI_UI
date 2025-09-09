"use client"

import type * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatGPTMessageBubble } from "@/components/chatgpt-message-bubble"
import { Mic, ArrowUp, Paperclip, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  citations?: string[]
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

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

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    // TODO: integrate uploads with backend
    const names = Array.from(files).map((f) => f.name)
    console.log("Selected files:", names)
  }

  // Show chat interface if a chat is selected
  if (selectedChatId && messages.length > 0) {
    return (
      <div className="h-full flex flex-col bg-background min-h-0">
        {/* Chat Messages */}
        <ScrollArea className="chat-scroll flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="py-8">
            {messages.map((msg) => (
              <ChatGPTMessageBubble
                key={msg.id}
                message={msg}
                isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === "assistant"}
              />
            ))}

            {/* Thinking loader when streaming but assistant hasn't started responding yet */}
            {isStreaming && (messages.length === 0 || messages[messages.length - 1].role !== "assistant") && (
              <div className="group mb-6">
                <div className="flex gap-4 max-w-4xl mx-auto px-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-green-600">
                      AI
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground leading-relaxed flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Thinking…</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="chatgpt-container mx-auto">
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message ChatGPT"
                  disabled={isStreaming}
                  className="chatgpt-pill"
                />
                {/* Left + inside input */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-2 top-1/2 -translate-y-1/2 chatgpt-ghost-icon"
                title="New chat or upload"
              >
                <Plus className="h-4 w-4" />
              </Button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-[0.375rem]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={cn(
                    "chatgpt-ghost-icon",
                    isListening && "text-primary",
                  )}
                  title="Voice"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                  {message.trim() && !isStreaming && (
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                      title="Send"
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
    <div className="h-full flex flex-col bg-background min-w-0">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="chatgpt-container w-full text-center md:mt-[-2vh]">
          <DynamicWelcomeHeading />

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything"
                disabled={isStreaming}
                className="chatgpt-pill w-full text-base"
                autoFocus
              />
              {/* Left + button inside input */}
              <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => handleAddFiles(e.target.files)} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-2 top-1/2 -translate-y-1/2 chatgpt-ghost-icon"
                title="New chat or upload"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-[0.375rem]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={cn(
                    "chatgpt-ghost-icon",
                    isListening && "text-primary bg-primary/10",
                  )}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="chatgpt-ghost-icon"
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

function DynamicWelcomeHeading() {
  const headings = [
    "What's on the agenda today?",
    "Ready when you are.",
    "How can I help today?",
    "What can I do for you?",
    "What are we working on?",
  ]
  // Use a deterministic initial value to avoid hydration mismatch, randomize after mount
  const [h, setH] = useState(headings[0])
  useEffect(() => {
    setH(headings[Math.floor(Math.random() * headings.length)])
  }, [])
  return (
    <h2 suppressHydrationWarning className="text-3xl font-semibold tracking-tight text-foreground mb-10 leading-tight text-balance">
      {h}
    </h2>
  )
}