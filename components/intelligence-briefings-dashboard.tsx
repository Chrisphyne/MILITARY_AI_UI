"use client"

import { useState, useEffect } from "react"
import { BriefingCard } from "./briefing-card"
import { BriefingViewer } from "./briefing-viewer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Calendar, TrendingUp } from "lucide-react"
import { militaryAPI, type BriefingResponse } from "@/lib/api"

interface BriefingData {
  id: string
  type: "daily" | "weekly"
  title: string
  summary: string
  classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  generated_at: string
  status: "ready" | "generating" | "error"
  key_points: string[]
  threat_level: "low" | "medium" | "high" | "critical"
  full_content: string
  recommendations: string[]
  sources: string[]
}

export function IntelligenceBriefingsDashboard() {
  const [briefings, setBriefings] = useState<BriefingData[]>([])
  const [filteredBriefings, setFilteredBriefings] = useState<BriefingData[]>([])
  const [selectedBriefing, setSelectedBriefing] = useState<BriefingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [classificationFilter, setClassificationFilter] = useState<string>("all")
  const [threatLevelFilter, setThreatLevelFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadBriefings()
  }, [])

  useEffect(() => {
    filterBriefings()
  }, [briefings, searchQuery, classificationFilter, threatLevelFilter, activeTab])

  const loadBriefings = async () => {
    try {
      setIsLoading(true)
      
      // Load actual briefings from API
      const [dailyBriefing, weeklyBriefing] = await Promise.allSettled([
        militaryAPI.getDailyBriefing(),
        militaryAPI.getWeeklyBriefing()
      ])
      
      const briefingsData: BriefingData[] = []
      
      if (dailyBriefing.status === 'fulfilled') {
        briefingsData.push({
          id: `daily-${Date.now()}`,
          type: "daily",
          title: "Daily Intelligence Brief - Defense Readiness",
          summary: "Current assessment of military unit readiness levels and operational capabilities.",
          classification_level: dailyBriefing.value.classification,
          generated_at: dailyBriefing.value.generated_at,
          status: "ready",
          key_points: extractKeyPoints(dailyBriefing.value.content),
          threat_level: "medium",
          full_content: dailyBriefing.value.content,
          recommendations: extractRecommendations(dailyBriefing.value.content),
          sources: dailyBriefing.value.agents_used.map(agent => `Agent: ${agent}`),
        })
      }
      
      if (weeklyBriefing.status === 'fulfilled') {
        briefingsData.push({
          id: `weekly-${Date.now()}`,
          type: "weekly",
          title: "Weekly Strategic Assessment - Regional Security",
          summary: "Comprehensive analysis of regional security threats and strategic positioning.",
          classification_level: weeklyBriefing.value.classification,
          generated_at: weeklyBriefing.value.generated_at,
          status: "ready",
          key_points: extractKeyPoints(weeklyBriefing.value.content),
          threat_level: "high",
          full_content: weeklyBriefing.value.content,
          recommendations: extractRecommendations(weeklyBriefing.value.content),
          sources: weeklyBriefing.value.agents_used.map(agent => `Agent: ${agent}`),
        })
      }
      
      // Add mock data if API calls failed
      if (briefingsData.length === 0) {
        briefingsData.push({
          id: "mock-daily",
          type: "daily",
          title: "Daily Intelligence Brief - Defense Readiness",
          summary: "Current assessment of military unit readiness levels and operational capabilities across all branches.",
          classification_level: "UNCLASSIFIED",
          generated_at: new Date().toISOString(),
          status: "ready",
          key_points: [
            "Army readiness at 85% operational capacity",
            "Navy fleet deployment status updated",
            "Air Force maintenance schedules optimized",
          ],
          threat_level: "medium",
          full_content: "Detailed analysis of current military readiness...",
          recommendations: ["Increase maintenance funding", "Expand training programs"],
          sources: ["Defense Intelligence Agency", "Joint Chiefs of Staff"],
        })
      }
      
      setBriefings(briefingsData)
    } catch (error) {
      console.error("Failed to load briefings:", error)
      // Set empty array on error
      setBriefings([])
    } finally {
      setIsLoading(false)
    }
  }

  const extractKeyPoints = (content: string): string[] => {
    // Simple extraction of key points from content
    const lines = content.split('\n').filter(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') || 
      line.trim().startsWith('*')
    )
    return lines.slice(0, 5).map(line => line.replace(/^[•\-*]\s*/, '').trim())
  }

  const extractRecommendations = (content: string): string[] => {
    // Simple extraction of recommendations from content
    const recommendationSection = content.toLowerCase().indexOf('recommendation')
    if (recommendationSection === -1) return []
    
    const afterRecommendations = content.slice(recommendationSection)
    const lines = afterRecommendations.split('\n').filter(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') || 
      line.trim().startsWith('*')
    )
    return lines.slice(0, 3).map(line => line.replace(/^[•\-*]\s*/, '').trim())
  }

  const filterBriefings = () => {
    let filtered = briefings

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((briefing) => briefing.type === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (briefing) =>
          briefing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          briefing.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by classification
    if (classificationFilter !== "all") {
      filtered = filtered.filter((briefing) => briefing.classification_level === classificationFilter)
    }

    // Filter by threat level
    if (threatLevelFilter !== "all") {
      filtered = filtered.filter((briefing) => briefing.threat_level === threatLevelFilter)
    }

    setFilteredBriefings(filtered)
  }

  const handleViewBriefing = (briefing: BriefingData) => {
    setSelectedBriefing(briefing)
  }

  const handleDownloadBriefing = (briefing: BriefingData) => {
    // Mock download functionality
    console.log("Downloading briefing:", briefing.title)
  }

  const handleRegenerateBriefing = async (briefing: BriefingData) => {
    // Mock regeneration functionality
    console.log("Regenerating briefing:", briefing.title)
    setBriefings((prev) => prev.map((b) => (b.id === briefing.id ? { ...b, status: "generating" as const } : b)))

    // Simulate regeneration delay
    setTimeout(() => {
      setBriefings((prev) => prev.map((b) => (b.id === briefing.id ? { ...b, status: "ready" as const } : b)))
    }, 3000)
  }

  const handleGenerateNewBriefing = () => {
    // Reload briefings to get fresh data
    loadBriefings()
  }

  if (selectedBriefing) {
    return (
      <BriefingViewer
        briefing={selectedBriefing}
        onBack={() => setSelectedBriefing(null)}
        onDownload={() => handleDownloadBriefing(selectedBriefing)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Intelligence Briefings</h1>
          <p className="text-muted-foreground text-pretty">
            Access daily and weekly intelligence briefings and strategic assessments
          </p>
        </div>
        <Button onClick={handleGenerateNewBriefing}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Briefing
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Briefings</TabsTrigger>
            <TabsTrigger value="daily">
              <Calendar className="h-4 w-4 mr-2" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <TrendingUp className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search briefings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={classificationFilter} onValueChange={setClassificationFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="UNCLASSIFIED">UNCLASSIFIED</SelectItem>
                <SelectItem value="CONFIDENTIAL">CONFIDENTIAL</SelectItem>
                <SelectItem value="SECRET">SECRET</SelectItem>
              </SelectContent>
            </Select>
            <Select value={threatLevelFilter} onValueChange={setThreatLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Threat Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading briefings...</div>
            </div>
          ) : filteredBriefings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {briefings.length === 0
                  ? "No briefings available. Generate your first briefing to get started."
                  : "No briefings match your search criteria."}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBriefings.map((briefing) => (
                <BriefingCard
                  key={briefing.id}
                  briefing={briefing}
                  onView={handleViewBriefing}
                  onDownload={handleDownloadBriefing}
                  onRegenerate={handleRegenerateBriefing}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}