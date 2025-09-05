"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { QuickActions } from "./quick-actions"
import { MilitaryDataDashboard } from "./military-data-dashboard"
import { useMilitaryAnalysis } from "@/hooks/use-military-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MilitaryConversation } from "@/lib/api"
import { AlertCircle, MessageSquare, Zap, BarChart3 } from "lucide-react"
import { QuerySuggestions } from "./query-suggestions"

interface ChatInterfaceProps {
  conversation: MilitaryConversation
}

export function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { messages, isStreaming, error, loadMessages, streamAnalysis } = useMilitaryAnalysis()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  useEffect(() => {
    if (conversation.id) {
      loadMessages(conversation.id)
    }
  }, [conversation.id, loadMessages])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (message: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => {
    setActiveTab("chat") // Switch to chat tab when sending a message
    await streamAnalysis(message, classification)
  }

  const handleQuickAction = async (query: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => {
    await handleSendMessage(query, classification)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-balance">{conversation.title}</h2>
            <p className="text-sm text-muted-foreground">Military Analysis Conversation</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Classification:</span>
            <span className={`classification-badge classification-${conversation.classification_level.toLowerCase()}`}>
              {conversation.classification_level}
            </span>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Data Dashboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-foreground mb-4">
                    <p className="text-lg font-medium mb-2 text-foreground">Start Your Military Analysis</p>
                    <p className="text-sm text-pretty text-muted-foreground">
                      Ask questions about defense data, unit readiness, budget analysis, or any military intelligence
                      topic.
                    </p>
                    <div className="mt-6">
                      <QuerySuggestions onSelectQuery={handleSendMessage} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isStreaming={
                        isStreaming && message.role === "assistant" && message === messages[messages.length - 1]
                      }
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isStreaming}
            defaultClassification={conversation.classification_level}
          />
        </TabsContent>

        <TabsContent value="actions" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <QuickActions onActionSelect={handleQuickAction} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <MilitaryDataDashboard />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
