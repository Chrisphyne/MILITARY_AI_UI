"use client"

import { useState, useCallback, useRef } from "react"
import { militaryAPI, type MilitaryMessage, type MilitaryConversation, type StreamChunk } from "@/lib/api"

interface MilitaryAnalysisState {
  isLoading: boolean
  error: string | null
  messages: MilitaryMessage[]
  conversationId: string | null
  isStreaming: boolean
}

export function useMilitaryAnalysis() {
  const [state, setState] = useState<MilitaryAnalysisState>({
    isLoading: false,
    error: null,
    messages: [],
    conversationId: null,
    isStreaming: false,
  })

  const streamingContentRef = useRef<string>("")

  const createStandaloneConversation = useCallback(
    async (
      title: string,
      classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" = "UNCLASSIFIED",
    ): Promise<MilitaryConversation> => {
      try {
        const conversation = await militaryAPI.createConversation({
          title,
          is_standalone: true,
          classification_level: classification,
        })

        setState((prev) => ({ ...prev, conversationId: conversation.id }))
        return conversation
      } catch (error) {
        setState((prev) => ({ ...prev, error: "Failed to create conversation" }))
        throw error
      }
    },
    [],
  )

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null, conversationId }))
      const messages = await militaryAPI.getMessages(conversationId)
      setState((prev) => ({
        ...prev,
        messages,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load messages",
        isLoading: false,
      }))
    }
  }, [])

  const streamAnalysis = useCallback(
    async (query: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" = "UNCLASSIFIED") => {
      try {
        setState((prev) => ({ ...prev, isStreaming: true, error: null }))

        // Add user message immediately
        const userMessage: MilitaryMessage = {
          id: `user-${Date.now()}`,
          conversation_id: state.conversationId || "",
          role: "user",
          content: query,
          classification_level: classification,
          created_at: new Date().toISOString(),
        }

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage],
        }))

        // Use existing conversation ID
        const conversationId = state.conversationId
        if (!conversationId) {
          throw new Error("No conversation selected")
        }

        // Reset streaming content
        streamingContentRef.current = ""

        // Start streaming
        await militaryAPI.streamAnalysis(query, conversationId, classification, (chunk: StreamChunk) => {
          if (chunk.type === "chunk" && chunk.content) {
            streamingContentRef.current += chunk.content

            setState((prev) => {
              const messages = [...prev.messages]
              const lastMessage = messages[messages.length - 1]

              if (lastMessage?.role === "assistant") {
                lastMessage.content = streamingContentRef.current
              } else {
                messages.push({
                  id: `assistant-${Date.now()}`,
                  conversation_id: conversationId!,
                  role: "assistant",
                  content: streamingContentRef.current,
                  classification_level: classification,
                  created_at: new Date().toISOString(),
                })
              }

              return { ...prev, messages }
            })
          } else if (chunk.type === "complete" && chunk.message) {
            setState((prev) => {
              const messages = [...prev.messages]
              const lastMessageIndex = messages.length - 1

              if (messages[lastMessageIndex]?.role === "assistant") {
                messages[lastMessageIndex] = chunk.message!
              }

              return {
                ...prev,
                messages,
                isStreaming: false,
              }
            })
          }
        })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to analyze query",
          isStreaming: false,
        }))
      }
    },
    [state.conversationId],
  )

  const clearConversation = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      messages: [],
      conversationId: null,
      isStreaming: false,
    })
  }, [])

  return {
    ...state,
    createStandaloneConversation,
    loadMessages,
    streamAnalysis,
    clearConversation,
  }
}
