"use client"

import { useState } from "react"
import { ChatGPTSidebar } from "@/components/chatgpt-sidebar"
import { ChatGPTMainInterface } from "@/components/chatgpt-main-interface"
import { useChatHistory } from "@/hooks/use-chat-history"
import { SecurityContextProvider } from "@/components/security-context-provider"

export default function HomePage() {
  const {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    addMessage,
    deleteConversation,
  } = useChatHistory()

  const [isStreaming, setIsStreaming] = useState(false)

  const handleNewChat = () => {
    createNewConversation()
  }

  const handleNewProject = () => {
    console.log("New project created")
  }

  const handleChatSelect = (chatId: string) => {
    selectConversation(chatId)
  }

  const handleSendMessage = async (message: string) => {
    if (!currentConversation) {
      createNewConversation()
    }

    // Add user message
    addMessage(message, "user")

    // Simulate AI response
    setIsStreaming(true)

    // Simulate streaming delay
    setTimeout(() => {
      const responses = [
        "I understand you're asking about that topic. Let me provide you with a comprehensive analysis.",
        "That's an interesting question. Based on the information available, here's what I can tell you:",
        "I'd be happy to help you with that. Here's a detailed explanation:",
        "Great question! Let me break this down for you step by step.",
        "I can certainly assist with that. Here's my analysis of the situation:",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addMessage(randomResponse, "assistant")
      setIsStreaming(false)
    }, 2000)
  }

  return (
    <SecurityContextProvider>
      <div className="flex h-screen bg-background">
        <ChatGPTSidebar
          onNewChat={handleNewChat}
          onNewProject={handleNewProject}
          selectedChatId={currentConversation?.id}
          onChatSelect={handleChatSelect}
        />
        <ChatGPTMainInterface
          messages={currentConversation?.messages || []}
          onSendMessage={handleSendMessage}
          selectedChatId={currentConversation?.id}
          isStreaming={isStreaming}
        />
      </div>
    </SecurityContextProvider>
  )
}