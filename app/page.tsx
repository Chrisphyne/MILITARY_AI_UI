"use client"

import { ChatGPTSidebar } from "@/components/chatgpt-sidebar"
import { ChatGPTMainInterface } from "@/components/chatgpt-main-interface"
import { SecurityContextProvider } from "@/components/security-context-provider"
import { useMilitaryAnalysis } from "@/hooks/use-military-analysis"
import { useEffect, useState, useRef } from "react"
import { militaryAPI, type MilitaryConversation, type MilitaryProject } from "@/lib/api"
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from "react-resizable-panels"
import { PanelLeftOpen } from "lucide-react"
import { MiniRail } from "@/components/mini-rail"

interface UIChatItem {
  id: string
  title: string
  timestamp: Date
  classification?: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
}

interface UIProject {
  id: string
  name: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  conversations: UIChatItem[]
}

export default function HomePage() {
  const {
    messages,
    conversationId,
    isStreaming,
    createStandaloneConversation,
    streamAnalysis,
    loadMessages,
    clearConversation,
  } = useMilitaryAnalysis()

  const [chats, setChats] = useState<UIChatItem[]>([])
  const [projects, setProjects] = useState<UIProject[]>([])

  const refreshData = async () => {
    try {
      // Standalone conversations
      const standalone: MilitaryConversation[] = await militaryAPI.getConversations(undefined, true)
      const standaloneItems: UIChatItem[] = standalone
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map((c) => ({ id: c.id, title: c.title, timestamp: new Date(c.updated_at), classification: c.classification_level }))
      setChats(standaloneItems)

      // Projects and their conversations
      const projs: MilitaryProject[] = await militaryAPI.getProjects()
      const projectItems: UIProject[] = []

      for (const p of projs) {
        try {
          const convos = await militaryAPI.getConversations(p.id, false)
          const convItems: UIChatItem[] = convos
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .map((c) => ({
              id: c.id,
              title: c.title,
              timestamp: new Date(c.updated_at),
              classification: c.classification_level,
            }))
          projectItems.push({
            id: p.id,
            name: p.name,
            classification: p.classification_level,
            conversations: convItems,
          })
        } catch (e) {
          console.warn(`Failed to load conversations for project ${p.id}`, e)
        }
      }

      setProjects(projectItems)
    } catch (e) {
      console.warn("Failed to load data", e)
    }
  }

  useEffect(() => {
    void refreshData()
  }, [])

  const handleNewChat = async () => {
    const conv = await createStandaloneConversation("New Chat", "UNCLASSIFIED")
    await refreshData()
    // Optionally, load messages for the new conversation
    try {
      await loadMessages(conv.id)
    } catch {}
  }

  const handleNewProject = () => {
    console.log("New project created")
  }

  const handleProjectCreate = async (name: string, category: string) => {
    try {
      await militaryAPI.createProject({
        name,
        description: category || "",
        classification_level: "UNCLASSIFIED",
      })
      await refreshData()
    } catch (e) {
      console.warn("Failed to create project", e)
    }
  }

  const handleChatSelect = async (chatId: string) => {
    try {
      await loadMessages(chatId)
    } catch (e) {
      console.warn("Failed to load messages", e)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      await militaryAPI.deleteConversation(chatId)
      if (conversationId === chatId) {
        clearConversation()
      }
      await refreshData()
    } catch (e) {
      console.warn("Failed to delete conversation", e)
    }
  }

  const handleSendMessage = async (message: string) => {
    // Ensure a conversation exists before sending
    if (!conversationId) {
      const conv = await createStandaloneConversation("New Chat", "UNCLASSIFIED")
      await refreshData()
      try {
        await loadMessages(conv.id)
      } catch {}
    }
    await streamAnalysis(message, "UNCLASSIFIED")
  }

  const handleCreateConversation = async (projectId: string) => {
    try {
      const conv = await militaryAPI.createConversation({
        project_id: projectId,
        title: "New Conversation",
        is_standalone: false,
        classification_level: "UNCLASSIFIED",
      })
      await refreshData()
      await loadMessages(conv.id)
    } catch (e) {
      console.warn("Failed to create conversation", e)
    }
  }

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await militaryAPI.updateConversation(chatId, { title: newTitle })
      await refreshData()
    } catch (e) {
      console.warn("Failed to rename conversation", e)
    }
  }

  const handleSetClassification = async (
    chatId: string,
    level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET",
  ) => {
    try {
      await militaryAPI.updateConversation(chatId, { classification_level: level })
      await refreshData()
    } catch (e) {
      console.warn("Failed to update classification", e)
    }
  }

  // Adapt MilitaryMessage[] to ChatGPTMainInterface expected shape
  const adaptedMessages = messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: new Date(m.created_at),
    citations: m.message_metadata?.source_urls ? Array.from(new Set(m.message_metadata.source_urls)) : undefined,
  }))

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [lastSidebarSize, setLastSidebarSize] = useState<number>(22)
  const sidebarRef = useRef<ImperativePanelHandle>(null)

  return (
    <SecurityContextProvider>
      <PanelGroup
        direction="horizontal"
        className="h-screen bg-background"
        onLayout={(sizes) => {
          // sizes is an array of percentages for [sidebar, main]
          const s = sizes?.[0] ?? 0
          // Track last non-trivial size so we can restore it when expanding
          if (s > 2) setLastSidebarSize(s)
          setSidebarCollapsed(s <= 0.5)
        }}
      >
        <Panel
          ref={sidebarRef}
          defaultSize={22}
          minSize={0}
          maxSize={40}
          collapsible
          collapsedSize={0}
          className="min-w-0 overflow-hidden"
        >
          <ChatGPTSidebar
            onNewChat={handleNewChat}
            onNewProject={handleNewProject}
            selectedChatId={conversationId || undefined}
            onChatSelect={handleChatSelect}
            chats={chats}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            onSetClassification={handleSetClassification}
            projects={projects}
            onCreateConversation={handleCreateConversation}
            onProjectCreate={handleProjectCreate}
            onToggleSidebar={() => sidebarRef.current?.collapse()}
          />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/30 cursor-col-resize" />
        <Panel minSize={30} className="overflow-hidden">
          <div className={"relative h-full " + (sidebarCollapsed ? "pl-10" : "") }>
            {sidebarCollapsed && (
              <MiniRail
                onOpenSidebar={() => sidebarRef.current?.resize(lastSidebarSize)}
                onNewChat={handleNewChat}
              />
            )}
            <ChatGPTMainInterface
              messages={adaptedMessages}
              onSendMessage={handleSendMessage}
              selectedChatId={conversationId || undefined}
              isStreaming={isStreaming}
            />
          </div>
        </Panel>
      </PanelGroup>
    </SecurityContextProvider>
  )
}