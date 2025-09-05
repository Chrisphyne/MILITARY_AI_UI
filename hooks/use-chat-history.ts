"use client"

import { useState, useCallback } from "react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    return newConversation
  }, [])

  const selectConversation = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((c) => c.id === conversationId)
      if (conversation) {
        setCurrentConversation(conversation)
      }
    },
    [conversations],
  )

  const addMessage = useCallback(
    (content: string, role: "user" | "assistant") => {
      if (!currentConversation) return

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: new Date(),
      }

      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        updatedAt: new Date(),
        // Update title based on first user message
        title:
          currentConversation.messages.length === 0 && role === "user"
            ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
            : currentConversation.title,
      }

      setCurrentConversation(updatedConversation)
      setConversations((prev) => prev.map((c) => (c.id === updatedConversation.id ? updatedConversation : c)))

      return newMessage
    },
    [currentConversation],
  )

  const deleteConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
      }
    },
    [currentConversation],
  )

  const updateConversationTitle = useCallback(
    (conversationId: string, newTitle: string) => {
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, title: newTitle } : c)))
      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) => (prev ? { ...prev, title: newTitle } : null))
      }
    },
    [currentConversation],
  )

  return {
    conversations,
    currentConversation,
    isLoading,
    createNewConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    updateConversationTitle,
  }
}
