const API_BASE_URL = process.env.NEXT_PUBLIC_MILITARY_API_URL || "http://34.42.252.158:7300"

export interface MilitaryProject {
  id: string
  name: string
  description: string
  classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  created_at: string
  updated_at: string
}

export interface MilitaryConversation {
  id: string
  project_id: string | null
  title: string
  is_standalone: boolean
  classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  created_at: string
  updated_at: string
}

export interface MilitaryMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  created_at: string
  metadata?: {
    analysis_type?: string
    agents_used?: string[]
    source_urls?: string[]
    domain?: string
  }
}

export interface StreamChunk {
  type: "status" | "chunk" | "complete"
  content?: string
  message?: MilitaryMessage
}

const mockProjects: MilitaryProject[] = [
  {
    id: "proj-1",
    name: "Operation Desert Shield Analysis",
    description: "Comprehensive analysis of desert operations and logistics",
    classification_level: "CONFIDENTIAL",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "proj-2",
    name: "Cyber Defense Assessment",
    description: "Evaluation of current cybersecurity posture and recommendations",
    classification_level: "SECRET",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-12T09:15:00Z",
  },
  {
    id: "proj-3",
    name: "Training Program Optimization",
    description: "Analysis of current training programs and efficiency improvements",
    classification_level: "UNCLASSIFIED",
    created_at: "2024-01-08T08:00:00Z",
    updated_at: "2024-01-14T16:45:00Z",
  },
]

const mockConversations: MilitaryConversation[] = [
  {
    id: "conv-1",
    project_id: "proj-1",
    title: "Logistics Chain Analysis",
    is_standalone: false,
    classification_level: "CONFIDENTIAL",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    id: "conv-2",
    project_id: null,
    title: "General Intelligence Briefing",
    is_standalone: true,
    classification_level: "UNCLASSIFIED",
    created_at: "2024-01-14T09:30:00Z",
    updated_at: "2024-01-14T09:30:00Z",
  },
]

class MilitaryAPI {
  private baseUrl: string
  private usesMockData = false

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async fetchWithFallback<T>(url: string, options?: RequestInit, mockData?: T): Promise<T> {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      console.warn(`API call failed, using mock data:`, error)
      this.usesMockData = true
      if (mockData !== undefined) {
        return mockData
      }
      throw error
    }
  }

  // Projects
  async getProjects(): Promise<MilitaryProject[]> {
    return this.fetchWithFallback(`${this.baseUrl}/api/military/projects`, undefined, mockProjects)
  }

  async createProject(data: {
    name: string
    description: string
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryProject> {
    const mockProject: MilitaryProject = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description,
      classification_level: data.classification_level,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return this.fetchWithFallback(
      `${this.baseUrl}/api/military/projects`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      mockProject,
    )
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/military/projects/${projectId}`, {
        method: "DELETE",
      })
      if (!response.ok && !this.usesMockData) {
        throw new Error("Failed to delete project")
      }
    } catch (error) {
      console.warn("Delete project failed, continuing with mock behavior:", error)
      // In mock mode, we just continue as if it succeeded
    }
  }

  // Conversations
  async getConversations(projectId?: string): Promise<MilitaryConversation[]> {
    const url = projectId
      ? `${this.baseUrl}/api/military/conversations?project_id=${projectId}`
      : `${this.baseUrl}/api/military/conversations`

    const filteredMockConversations = projectId
      ? mockConversations.filter((c) => c.project_id === projectId)
      : mockConversations.filter((c) => c.is_standalone)

    return this.fetchWithFallback(url, undefined, filteredMockConversations)
  }

  async createConversation(data: {
    project_id?: string
    title: string
    is_standalone: boolean
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryConversation> {
    const mockConversation: MilitaryConversation = {
      id: `conv-${Date.now()}`,
      project_id: data.project_id || null,
      title: data.title,
      is_standalone: data.is_standalone,
      classification_level: data.classification_level,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return this.fetchWithFallback(
      `${this.baseUrl}/api/military/conversations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      mockConversation,
    )
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/military/conversations/${conversationId}`, {
        method: "DELETE",
      })
      if (!response.ok && !this.usesMockData) {
        throw new Error("Failed to delete conversation")
      }
    } catch (error) {
      console.warn("Delete conversation failed, continuing with mock behavior:", error)
    }
  }

  // Messages
  async getMessages(conversationId: string): Promise<MilitaryMessage[]> {
    const mockMessages: MilitaryMessage[] = [
      {
        id: "msg-1",
        conversation_id: conversationId,
        role: "user",
        content: "What is the current status of our logistics operations?",
        classification_level: "UNCLASSIFIED",
        created_at: "2024-01-15T11:05:00Z",
      },
      {
        id: "msg-2",
        conversation_id: conversationId,
        role: "assistant",
        content:
          "Based on current intelligence, our logistics operations are operating at 85% efficiency. Key supply chains are secure with minor delays in non-critical equipment delivery.",
        classification_level: "CONFIDENTIAL",
        created_at: "2024-01-15T11:06:00Z",
        metadata: {
          analysis_type: "logistics_assessment",
          agents_used: ["logistics_agent", "intelligence_agent"],
          domain: "military_operations",
        },
      },
    ]

    return this.fetchWithFallback(
      `${this.baseUrl}/api/military/messages?conversation_id=${conversationId}`,
      undefined,
      mockMessages,
    )
  }

  async createMessage(data: {
    conversation_id: string
    role: "user" | "assistant"
    content: string
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryMessage> {
    const mockMessage: MilitaryMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: data.conversation_id,
      role: data.role,
      content: data.content,
      classification_level: data.classification_level,
      created_at: new Date().toISOString(),
    }

    return this.fetchWithFallback(
      `${this.baseUrl}/api/military/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      mockMessage,
    )
  }

  // Analysis
  async streamAnalysis(
    query: string,
    conversationId?: string,
    classificationLevel: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" = "UNCLASSIFIED",
    onChunk?: (chunk: StreamChunk) => void,
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        query,
        classification_level: classificationLevel,
      })

      if (conversationId) {
        params.append("conversation_id", conversationId)
      }

      const eventSource = new EventSource(`${this.baseUrl}/api/military/analyze/stream?${params}`)

      return new Promise((resolve, reject) => {
        eventSource.onmessage = (event) => {
          try {
            const data: StreamChunk = JSON.parse(event.data)
            onChunk?.(data)

            if (data.type === "complete") {
              eventSource.close()
              resolve()
            }
          } catch (error) {
            eventSource.close()
            reject(error)
          }
        }

        eventSource.onerror = () => {
          eventSource.close()
          reject(new Error("Stream connection failed"))
        }
      })
    } catch (error) {
      // Mock streaming response for demo
      console.warn("Streaming API not available, using mock response:", error)
      this.usesMockData = true

      const mockResponse = `Based on your query "${query}", here is a comprehensive military analysis:

This assessment indicates current operational readiness at optimal levels. Key strategic positions remain secure with enhanced surveillance protocols in effect.

Recommendations:
1. Maintain current defensive postures
2. Continue intelligence gathering operations
3. Monitor supply chain efficiency

Classification: ${classificationLevel}`

      // Simulate streaming chunks
      const chunks = mockResponse.split(" ")
      let currentText = ""

      for (let i = 0; i < chunks.length; i++) {
        setTimeout(() => {
          currentText += (i > 0 ? " " : "") + chunks[i]
          onChunk?.({
            type: "chunk",
            content: chunks[i] + (i < chunks.length - 1 ? " " : ""),
          })

          if (i === chunks.length - 1) {
            setTimeout(() => {
              onChunk?.({
                type: "complete",
                message: {
                  id: `msg-${Date.now()}`,
                  conversation_id: conversationId || "",
                  role: "assistant",
                  content: mockResponse,
                  classification_level: classificationLevel,
                  created_at: new Date().toISOString(),
                  metadata: {
                    analysis_type: "general_analysis",
                    agents_used: ["analysis_agent"],
                    domain: "military_intelligence",
                  },
                },
              })
            }, 100)
          }
        }, i * 50)
      }
    }
  }

  // Intelligence Briefings
  async getDailyBriefing(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/military/briefings/daily`)
    if (!response.ok) throw new Error("Failed to fetch daily briefing")
    return response.json()
  }

  async getWeeklyBriefing(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/military/briefings/weekly`)
    if (!response.ok) throw new Error("Failed to fetch weekly briefing")
    return response.json()
  }

  // Military Data Endpoints
  async getMilitaryData(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/military/data/${endpoint}`)
    if (!response.ok) throw new Error(`Failed to fetch military data: ${endpoint}`)
    return response.json()
  }

  async getPersonnelData(): Promise<any> {
    return this.getMilitaryData("personnel")
  }

  async getBudgetData(): Promise<any> {
    return this.getMilitaryData("budget")
  }

  async getEquipmentData(): Promise<any> {
    return this.getMilitaryData("equipment")
  }

  async getReadinessData(): Promise<any> {
    return this.getMilitaryData("readiness")
  }

  async getOperationalData(): Promise<any> {
    return this.getMilitaryData("operational")
  }
}

export const militaryAPI = new MilitaryAPI()
