"use client"

import { useState, useEffect } from "react"
import { BriefingCard } from "./briefing-card"
import { BriefingViewer } from "./briefing-viewer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Calendar, TrendingUp } from "lucide-react"

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
      // Mock data - in a real app, this would come from the API
      const mockBriefings: BriefingData[] = [
        {
          id: "daily-001",
          type: "daily",
          title: "Daily Intelligence Brief - Defense Readiness",
          summary:
            "Current assessment of military unit readiness levels and operational capabilities across all branches.",
          classification_level: "CONFIDENTIAL",
          generated_at: new Date().toISOString(),
          status: "ready",
          key_points: [
            "Army readiness at 85% operational capacity",
            "Navy fleet deployment status updated",
            "Air Force maintenance schedules optimized",
            "Joint training exercises scheduled for next quarter",
          ],
          threat_level: "medium",
          full_content: "Detailed analysis of current military readiness...",
          recommendations: [
            "Increase maintenance funding for aging equipment",
            "Expand joint training programs",
            "Review personnel allocation strategies",
          ],
          sources: ["Defense Intelligence Agency", "Joint Chiefs of Staff", "Branch Command Reports"],
        },
        {
          id: "weekly-001",
          type: "weekly",
          title: "Weekly Strategic Assessment - Regional Security",
          summary:
            "Comprehensive analysis of regional security threats and strategic positioning for the upcoming week.",
          classification_level: "SECRET",
          generated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "ready",
          key_points: [
            "Regional threat assessment updated",
            "Border security measures enhanced",
            "Intelligence sharing protocols activated",
            "Strategic asset positioning reviewed",
          ],
          threat_level: "high",
          full_content: "Weekly strategic assessment covering regional developments...",
          recommendations: [
            "Enhance border surveillance capabilities",
            "Increase intelligence coordination",
            "Review strategic asset deployment",
          ],
          sources: ["National Intelligence Council", "Regional Command Centers", "Allied Intelligence Services"],
        },
        {
          id: "daily-002",
          type: "daily",
          title: "Daily Operational Brief - Equipment Status",
          summary: "Status report on military equipment, maintenance schedules, and procurement updates.",
          classification_level: "UNCLASSIFIED",
          generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready",
          key_points: [
            "Equipment maintenance on schedule",
            "New procurement contracts approved",
            "Technology upgrades in progress",
          ],
          threat_level: "low",
          full_content: "Daily operational briefing on equipment status...",
          recommendations: ["Continue current maintenance schedule", "Monitor new technology integration"],
          sources: ["Logistics Command", "Procurement Office", "Technical Services"],
        },
      ]
      setBriefings(mockBriefings)
    } catch (error) {
      console.error("Failed to load briefings:", error)
    } finally {
      setIsLoading(false)
    }
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
    // Mock new briefing generation
    console.log("Generating new briefing...")
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
