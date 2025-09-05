const API_BASE_URL = "http://34.42.252.158:7300"

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
  message_metadata?: {
    analysis_type?: string
    agents_used?: string[]
    source_urls?: string[]
    domain?: string
  }
}

export interface StreamChunk {
  type: "status" | "chunk" | "complete" | "error"
  content?: string
  message?: MilitaryMessage
}

export interface MilitaryAnalysisResponse {
  query: string
  answer: string
  analysis_type: string
  agents_used: string[]
  data_insights?: string
  research_findings?: string
  source_urls: string[]
  sources_count: number
  success: boolean
  timestamp: string
  conversation_id?: string
  domain: string
}

export interface BriefingResponse {
  briefing_type: "daily" | "weekly"
  content: string
  generated_at: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  agents_used: string[]
}

class MilitaryAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API call failed for ${url}:`, error)
      throw error
    }
  }

  // Health and Status
  async checkHealth(): Promise<{ status: string; database: string; domain: string; timestamp: string }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/health`)
  }

  async getStatus(): Promise<{
    status: string
    version: string
    database: string
    domain: string
    agents: string[]
    timestamp: string
  }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/status`)
  }

  // Projects
  async getProjects(): Promise<MilitaryProject[]> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/projects`)
  }

  async getProject(projectId: string): Promise<MilitaryProject> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/projects/${projectId}`)
  }

  async createProject(data: {
    name: string
    description: string
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryProject> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(projectId: string): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/projects/${projectId}`, {
      method: "DELETE",
    })
  }

  // Conversations
  async getConversations(projectId?: string, standalone?: boolean): Promise<MilitaryConversation[]> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    if (standalone !== undefined) params.append('standalone', standalone.toString())
    
    const url = `${this.baseUrl}/api/military/conversations${params.toString() ? `?${params}` : ''}`
    return this.fetchWithErrorHandling(url)
  }

  async getConversation(conversationId: string): Promise<MilitaryConversation> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/conversations/${conversationId}`)
  }

  async createConversation(data: {
    project_id?: string
    title: string
    is_standalone: boolean
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryConversation> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/conversations`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteConversation(conversationId: string): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/conversations/${conversationId}`, {
      method: "DELETE",
    })
  }

  // Messages
  async getMessages(conversationId: string): Promise<MilitaryMessage[]> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/messages/${conversationId}`)
  }

  async createMessage(data: {
    conversation_id: string
    role: "user" | "assistant"
    content: string
    classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryMessage> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Analysis
  async analyze(data: {
    query: string
    conversation_id?: string
    classification_level?: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  }): Promise<MilitaryAnalysisResponse> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/analyze`, {
      method: "POST",
      body: JSON.stringify({
        classification_level: "UNCLASSIFIED",
        ...data,
      }),
    })
  }

  async streamAnalysis(
    query: string,
    conversationId?: string,
    classificationLevel: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" = "UNCLASSIFIED",
    onChunk?: (chunk: StreamChunk) => void,
  ): Promise<void> {
    const params = new URLSearchParams({
      query,
      classification_level: classificationLevel,
    })

    if (conversationId) {
      params.append("conversation_id", conversationId)
    }

    try {
      const eventSource = new EventSource(`${this.baseUrl}/api/military/analyze/stream?${params}`)

      return new Promise((resolve, reject) => {
        eventSource.onmessage = (event) => {
          try {
            const data: StreamChunk = JSON.parse(event.data)
            onChunk?.(data)

            if (data.type === "complete") {
              eventSource.close()
              resolve()
            } else if (data.type === "error") {
              eventSource.close()
              reject(new Error(data.message || "Analysis failed"))
            }
          } catch (error) {
            eventSource.close()
            reject(error)
          }
        }

        eventSource.onerror = (error) => {
          eventSource.close()
          reject(new Error("Stream connection failed"))
        }
      })
    } catch (error) {
      console.error("Streaming analysis failed:", error)
      throw error
    }
  }

  // Intelligence Briefings
  async getDailyBriefing(): Promise<BriefingResponse> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/briefing/daily`)
  }

  async getWeeklyBriefing(): Promise<BriefingResponse> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/briefing/weekly`)
  }

  // Military Data Endpoints
  async getMilitaryUnits(): Promise<{ units: string[]; count: number }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/units`)
  }

  async getMilitaryEquipment(): Promise<{ equipment_types: string[]; count: number }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/military/equipment`)
  }

  // Legacy methods for backward compatibility
  async getMilitaryData(endpoint: string): Promise<any> {
    console.warn(`getMilitaryData(${endpoint}) is deprecated. Use specific methods instead.`)
    
    switch (endpoint) {
      case "units":
        return this.getMilitaryUnits()
      case "equipment":
        return this.getMilitaryEquipment()
      default:
        throw new Error(`Unknown military data endpoint: ${endpoint}`)
    }
  }

  async getPersonnelData(): Promise<any> {
    console.warn("getPersonnelData() is not implemented in the current API")
    return { message: "Personnel data endpoint not available" }
  }

  async getBudgetData(): Promise<any> {
    console.warn("getBudgetData() is not implemented in the current API")
    return { message: "Budget data endpoint not available" }
  }

  async getEquipmentData(): Promise<any> {
    return this.getMilitaryEquipment()
  }

  async getReadinessData(): Promise<any> {
    console.warn("getReadinessData() is not implemented in the current API")
    return { message: "Readiness data endpoint not available" }
  }

  async getOperationalData(): Promise<any> {
    console.warn("getOperationalData() is not implemented in the current API")
    return { message: "Operational data endpoint not available" }
  }
}

export const militaryAPI = new MilitaryAPI()