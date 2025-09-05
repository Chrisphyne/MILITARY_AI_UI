"use client"

import { useState } from "react"
import { ConversationSidebar } from "./conversation-sidebar"
import { CreateConversationDialog } from "./create-conversation-dialog"
import { ChatInterface } from "./chat-interface"
import { SecureWorkspace } from "./secure-workspace"
import type { MilitaryProject, MilitaryConversation } from "@/lib/api"

interface ProjectWorkspaceProps {
  project: MilitaryProject | null
  onBackToProjects: () => void
}

export function ProjectWorkspace({ project, onBackToProjects }: ProjectWorkspaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<MilitaryConversation | null>(null)
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)

  const handleConversationSelect = (conversation: MilitaryConversation) => {
    setSelectedConversation(conversation)
  }

  const handleNewConversation = () => {
    setShowNewConversationDialog(true)
  }

  const handleConversationCreated = (conversation: MilitaryConversation) => {
    setSelectedConversation(conversation)
    setShowNewConversationDialog(false)
  }

  return (
    <SecureWorkspace project={project}>
      <div className="flex h-full">
        <ConversationSidebar
          project={project}
          selectedConversationId={selectedConversation?.id || null}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onBackToProjects={onBackToProjects}
        />

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ChatInterface conversation={selectedConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-balance">
                  {project ? `Welcome to ${project.name}` : "Military Analysis Canvas"}
                </h2>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Select an existing conversation from the sidebar or create a new one to start your military analysis.
                </p>
                <CreateConversationDialog
                  project={project}
                  onConversationCreated={handleConversationCreated}
                  trigger={
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Start New Analysis
                    </button>
                  }
                />
              </div>
            </div>
          )}
        </div>

        {showNewConversationDialog && (
          <CreateConversationDialog project={project} onConversationCreated={handleConversationCreated} />
        )}
      </div>
    </SecureWorkspace>
  )
}
