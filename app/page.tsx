"use client"

import { useState } from "react"
import { ChatGPTSidebar } from "@/components/chatgpt-sidebar"
import { ChatGPTMainInterface } from "@/components/chatgpt-main-interface"
import { useChatHistory } from "@/hooks/use-chat-history"
import { useMilitaryAnalysis } from "@/hooks/use-military-analysis"
import { SecurityContextProvider } from "@/components/security-context-provider"

export default function HomePage() {
  const { messages, isStreaming, streamAnalysis, createStandaloneConversation, loadMessages, clearConversation } = useMilitaryAnalysis()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)


  const handleNewChat = () => {
    clearConversation()
    setSelectedChatId(null)
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
    loadMessages(chatId)
  }

  const handleSendMessage = async (message: string) => {
    if (!selectedChatId) {
      // Create a new standalone conversation
      const conversation = await createStandaloneConversation("New Chat")
      setSelectedChatId(conversation.id)
    }

    // Stream the analysis
    await streamAnalysis(message, "UNCLASSIFIED")
  }

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Convert military messages to chat messages format
  const chatMessages = messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.created_at)
  }))

  return (
    <SecurityContextProvider>
      <div className="flex h-screen bg-background">
        <ChatGPTSidebar
          onNewChat={handleNewChat}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <ChatGPTMainInterface
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          selectedChatId={selectedChatId}
          isStreaming={isStreaming}
        />
      </div>
    </SecurityContextProvider>
  )
}