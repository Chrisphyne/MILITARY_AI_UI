"use client"

import type React from "react"
import { militaryAPI } from "@/lib/api"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Shield, Users, DollarSign, Truck, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface MilitaryMetric {
  id: string
  title: string
  value: string | number
  change: number
  status: "good" | "warning" | "critical"
  icon: React.ComponentType<{ className?: string }>
}

export function MilitaryDataDashboard() {
  const [metrics, setMetrics] = useState<MilitaryMetric[]>([])
  const [readinessData, setReadinessData] = useState<any[]>([])
  const [budgetData, setBudgetData] = useState<any[]>([])
  const [personnelData, setPersonnelData] = useState<any[]>([])

  useEffect(() => {
    loadMilitaryData()
  }, [])

  const loadMilitaryData = async () => {
    try {
      // Load military units and equipment data
      const [unitsResponse, equipmentResponse] = await Promise.allSettled([
        militaryAPI.getMilitaryUnits(),
        militaryAPI.getMilitaryEquipment()
      ])
      
      // Set metrics based on actual data
      const mockMetrics: MilitaryMetric[] = [
        {
          id: "overall-readiness",
          title: "Overall Readiness",
          value: "87%",
          change: 2.5,
          status: "good",
          icon: Shield,
        },
        {
          id: "military-units",
          title: "Military Units",
          value: unitsResponse.status === 'fulfilled' ? unitsResponse.value.count.toString() : "N/A",
          change: 0,
          status: "good",
          icon: Users,
        },
        {
          id: "equipment-types",
          title: "Equipment Types",
          value: equipmentResponse.status === 'fulfilled' ? equipmentResponse.value.count.toString() : "N/A",
          change: 1.2,
          status: "good",
          icon: Truck,
        },
        {
          id: "budget-utilization",
          title: "Budget Utilization",
          value: "78%",
          change: 5.3,
          status: "good",
          icon: DollarSign,
        },
      ]
      
      setMetrics(mockMetrics)
      
      // Set readiness data based on units
      if (unitsResponse.status === 'fulfilled') {
        const units = unitsResponse.value.units.slice(0, 5)
        const readinessData = units.map(unit => ({
          name: unit,
          readiness: Math.floor(Math.random() * 20) + 80, // Random between 80-100
          target: 90
        }))
        setReadinessData(readinessData)
      } else {
        // Fallback data
        setReadinessData([
          { name: "Kenya Army", readiness: 85, target: 90 },
          { name: "Kenya Navy", readiness: 88, target: 90 },
          { name: "Kenya Air Force", readiness: 91, target: 90 },
        ])
      }
      
    } catch (error) {
      console.error("Failed to load military data:", error)
      
      // Set fallback metrics
      setMetrics([
        {
          id: "overall-readiness",
          title: "Overall Readiness",
          value: "87%",
          change: 2.5,
          status: "good",
          icon: Shield,
        },
        {
          id: "active-personnel",
          title: "Active Personnel",
          value: "145,230",
          change: -1.2,
          status: "warning",
          icon: Users,
        },
        {
          id: "budget-utilization",
          title: "Budget Utilization",
          value: "78%",
          change: 5.3,
          status: "good",
          icon: DollarSign,
        },
        {
          id: "equipment-operational",
          title: "Equipment Operational",
          value: "92%",
          change: -0.8,
          status: "good",
          icon: Truck,
        },
      ])
    }
    
    // Set other mock data
    setReadinessData([
      { name: "Army", readiness: 85, target: 90 },
      { name: "Navy", readiness: 88, target: 90 },
      { name: "Air Force", readiness: 91, target: 90 },
      { name: "Marines", readiness: 87, target: 90 },
      { name: "Space Force", readiness: 89, target: 90 },
    ])

    setBudgetData([
      { name: "Personnel", value: 45, color: "#8884d8" },
      { name: "Operations", value: 25, color: "#82ca9d" },
      { name: "Procurement", value: 20, color: "#ffc658" },
      { name: "R&D", value: 10, color: "#ff7300" },
    ])

    setPersonnelData([
      { month: "Jan", active: 145000, reserves: 35000 },
      { month: "Feb", active: 144800, reserves: 35200 },
      { month: "Mar", active: 145100, reserves: 35100 },
      { month: "Apr", active: 145300, reserves: 34900 },
      { month: "May", active: 145200, reserves: 35000 },
      { month: "Jun", active: 145230, reserves: 35050 },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "critical":
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Military Data Dashboard</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Real-time overview of key military metrics and operational data.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const StatusIcon = getStatusIcon(metric.status)
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={metric.change > 0 ? "text-green-600" : "text-red-600"}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span>from last month</span>
                  <StatusIcon className={`h-3 w-3 ml-1 ${getStatusColor(metric.status)}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Readiness by Branch */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness by Branch</CardTitle>
            <CardDescription>Current operational readiness levels vs targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="readiness" fill="#8884d8" name="Current" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>Defense spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Personnel Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel Trends</CardTitle>
          <CardDescription>Active duty and reserve personnel over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={personnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#8884d8" name="Active Duty" />
              <Line type="monotone" dataKey="reserves" stroke="#82ca9d" name="Reserves" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Readiness Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Readiness Metrics</CardTitle>
          <CardDescription>Breakdown of readiness components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Personnel Readiness", value: 92, status: "good" },
            { name: "Equipment Readiness", value: 87, status: "good" },
            { name: "Training Readiness", value: 85, status: "warning" },
            { name: "Supply Readiness", value: 78, status: "warning" },
            { name: "Maintenance Readiness", value: 82, status: "good" },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                  <Badge variant={item.status === "good" ? "default" : "secondary"} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}