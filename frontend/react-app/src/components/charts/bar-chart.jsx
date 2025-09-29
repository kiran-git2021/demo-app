"use client"

import * as React from "react"
import { CartesianGrid, XAxis, BarChart, Bar, ReferenceArea } from "recharts"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

export const description = "An interactive bar chart with zoom functionality"

const chartData = [
  { date: "2024-04-01", Parameter1: 222, Parameter2: 150 },
  { date: "2024-04-02", Parameter1: 97, Parameter2: 180 },
  { date: "2024-04-03", Parameter1: 167, Parameter2: 120 },
  { date: "2024-04-04", Parameter1: 242, Parameter2: 260 },
  { date: "2024-04-05", Parameter1: 373, Parameter2: 290 },
  { date: "2024-04-06", Parameter1: 301, Parameter2: 340 },
  { date: "2024-04-07", Parameter1: 245, Parameter2: 180 },
  { date: "2024-04-08", Parameter1: 409, Parameter2: 320 },
  { date: "2024-04-09", Parameter1: 59, Parameter2: 110 },
  { date: "2024-04-10", Parameter1: 261, Parameter2: 190 },
  { date: "2024-04-11", Parameter1: 327, Parameter2: 350 },
  { date: "2024-04-12", Parameter1: 292, Parameter2: 210 },
  { date: "2024-04-13", Parameter1: 342, Parameter2: 380 },
  { date: "2024-04-14", Parameter1: 137, Parameter2: 220 },
  { date: "2024-04-15", Parameter1: 120, Parameter2: 170 },
  { date: "2024-04-16", Parameter1: 138, Parameter2: 190 },
  { date: "2024-04-17", Parameter1: 446, Parameter2: 360 },
  { date: "2024-04-18", Parameter1: 364, Parameter2: 410 },
  { date: "2024-04-19", Parameter1: 243, Parameter2: 180 },
  { date: "2024-04-20", Parameter1: 89, Parameter2: 150 },
  { date: "2024-04-21", Parameter1: 137, Parameter2: 200 },
  { date: "2024-04-22", Parameter1: 224, Parameter2: 170 },
  { date: "2024-04-23", Parameter1: 138, Parameter2: 230 },
  { date: "2024-04-24", Parameter1: 387, Parameter2: 290 },
  { date: "2024-04-25", Parameter1: 215, Parameter2: 250 },
  { date: "2024-04-26", Parameter1: 75, Parameter2: 130 },
  { date: "2024-04-27", Parameter1: 383, Parameter2: 420 },
  { date: "2024-04-28", Parameter1: 122, Parameter2: 180 },
  { date: "2024-04-29", Parameter1: 315, Parameter2: 240 },
  { date: "2024-04-30", Parameter1: 454, Parameter2: 380 },
  { date: "2024-05-01", Parameter1: 165, Parameter2: 220 },
  { date: "2024-05-02", Parameter1: 293, Parameter2: 310 },
  { date: "2024-05-03", Parameter1: 247, Parameter2: 190 },
  { date: "2024-05-04", Parameter1: 385, Parameter2: 420 },
  { date: "2024-05-05", Parameter1: 481, Parameter2: 390 },
  { date: "2024-05-06", Parameter1: 498, Parameter2: 520 },
  { date: "2024-05-07", Parameter1: 388, Parameter2: 300 },
  { date: "2024-05-08", Parameter1: 149, Parameter2: 210 },
  { date: "2024-05-09", Parameter1: 227, Parameter2: 180 },
  { date: "2024-05-10", Parameter1: 293, Parameter2: 330 },
  { date: "2024-05-11", Parameter1: 335, Parameter2: 270 },
  { date: "2024-05-12", Parameter1: 197, Parameter2: 240 },
  { date: "2024-05-13", Parameter1: 197, Parameter2: 160 },
  { date: "2024-05-14", Parameter1: 448, Parameter2: 490 },
  { date: "2024-05-15", Parameter1: 473, Parameter2: 380 },
  { date: "2024-05-16", Parameter1: 338, Parameter2: 400 },
  { date: "2024-05-17", Parameter1: 499, Parameter2: 420 },
  { date: "2024-05-18", Parameter1: 315, Parameter2: 350 },
  { date: "2024-05-19", Parameter1: 235, Parameter2: 180 },
  { date: "2024-05-20", Parameter1: 177, Parameter2: 230 },
  { date: "2024-05-21", Parameter1: 82, Parameter2: 140 },
  { date: "2024-05-22", Parameter1: 81, Parameter2: 120 },
  { date: "2024-05-23", Parameter1: 252, Parameter2: 290 },
  { date: "2024-05-24", Parameter1: 294, Parameter2: 220 },
  { date: "2024-05-25", Parameter1: 201, Parameter2: 250 },
  { date: "2024-05-26", Parameter1: 213, Parameter2: 170 },
  { date: "2024-05-27", Parameter1: 420, Parameter2: 460 },
  { date: "2024-05-28", Parameter1: 233, Parameter2: 190 },
  { date: "2024-05-29", Parameter1: 78, Parameter2: 130 },
  { date: "2024-05-30", Parameter1: 340, Parameter2: 280 },
  { date: "2024-05-31", Parameter1: 178, Parameter2: 230 },
  { date: "2024-06-01", Parameter1: 178, Parameter2: 200 },
  { date: "2024-06-02", Parameter1: 470, Parameter2: 410 },
  { date: "2024-06-03", Parameter1: 103, Parameter2: 160 },
  { date: "2024-06-04", Parameter1: 439, Parameter2: 380 },
  { date: "2024-06-05", Parameter1: 88, Parameter2: 140 },
  { date: "2024-06-06", Parameter1: 294, Parameter2: 250 },
  { date: "2024-06-07", Parameter1: 323, Parameter2: 370 },
  { date: "2024-06-08", Parameter1: 385, Parameter2: 320 },
  { date: "2024-06-09", Parameter1: 438, Parameter2: 480 },
  { date: "2024-06-10", Parameter1: 155, Parameter2: 200 },
  { date: "2024-06-11", Parameter1: 92, Parameter2: 150 },
  { date: "2024-06-12", Parameter1: 492, Parameter2: 420 },
  { date: "2024-06-13", Parameter1: 81, Parameter2: 130 },
  { date: "2024-06-14", Parameter1: 426, Parameter2: 380 },
  { date: "2024-06-15", Parameter1: 307, Parameter2: 350 },
  { date: "2024-06-16", Parameter1: 371, Parameter2: 310 },
  { date: "2024-06-17", Parameter1: 475, Parameter2: 520 },
  { date: "2024-06-18", Parameter1: 107, Parameter2: 170 },
  { date: "2024-06-19", Parameter1: 341, Parameter2: 290 },
  { date: "2024-06-20", Parameter1: 408, Parameter2: 450 },
  { date: "2024-06-21", Parameter1: 169, Parameter2: 210 },
  { date: "2024-06-22", Parameter1: 317, Parameter2: 270 },
  { date: "2024-06-23", Parameter1: 480, Parameter2: 530 },
  { date: "2024-06-24", Parameter1: 132, Parameter2: 180 },
  { date: "2024-06-25", Parameter1: 141, Parameter2: 190 },
  { date: "2024-06-26", Parameter1: 434, Parameter2: 380 },
  { date: "2024-06-27", Parameter1: 448, Parameter2: 490 },
  { date: "2024-06-28", Parameter1: 149, Parameter2: 200 },
  { date: "2024-06-29", Parameter1: 103, Parameter2: 160 },
  { date: "2024-06-30", Parameter1: 446, Parameter2: 400 },
]

const chartConfig = {
  Parameter1: {
    label: "Parameter1",
    color: "var(--chart-1)",
  },
  Parameter2: {
    label: "Parameter2",
    color: "var(--chart-2)",
  },
}

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] = React.useState("Parameter1")

  const [zoomArea, setZoomArea] = React.useState(null)
  const [isZooming, setIsZooming] = React.useState(false)
  const [zoomDomain, setZoomDomain] = React.useState({ left: 0, right: chartData.length - 1 })
  const [originalDomain] = React.useState({ left: 0, right: chartData.length - 1 })

  const total = React.useMemo(
    () => ({
      Parameter1: chartData.reduce((acc, curr) => acc + curr.Parameter1, 0),
      Parameter2: chartData.reduce((acc, curr) => acc + curr.Parameter2, 0),
    }),
    [],
  )

  // Mouse handlers for drag-to-zoom
  const handleMouseDown = (e) => {
    if (e && e.activeLabel) {
      const index = chartData.findIndex((item) => item.date === e.activeLabel)
      setZoomArea({ left: index, right: index })
      setIsZooming(true)
    }
  }

  const handleMouseMove = (e) => {
    if (isZooming && e && e.activeLabel) {
      const index = chartData.findIndex((item) => item.date === e.activeLabel)
      setZoomArea((prev) => (prev ? { ...prev, right: index } : null))
    }
  }

  const handleMouseUp = () => {
    if (zoomArea && zoomArea.left !== zoomArea.right) {
      const left = Math.min(zoomArea.left, zoomArea.right)
      const right = Math.max(zoomArea.left, zoomArea.right)
      setZoomDomain({ left, right })
    }
    setZoomArea(null)
    setIsZooming(false)
  }

  // Zoom buttons
  const zoomIn = () => {
    const range = zoomDomain.right - zoomDomain.left
    const center = (zoomDomain.left + zoomDomain.right) / 2
    const newRange = Math.max(1, range * 0.7)
    const newLeft = Math.max(0, Math.floor(center - newRange / 2))
    const newRight = Math.min(chartData.length - 1, Math.ceil(center + newRange / 2))
    setZoomDomain({ left: newLeft, right: newRight })
  }

  const zoomOut = () => {
    const range = zoomDomain.right - zoomDomain.left
    const center = (zoomDomain.left + zoomDomain.right) / 2
    const newRange = Math.min(chartData.length - 1, range * 1.3)
    const newLeft = Math.max(0, Math.floor(center - newRange / 2))
    const newRight = Math.min(chartData.length - 1, Math.ceil(center + newRange / 2))
    setZoomDomain({ left: newLeft, right: newRight })
  }

  const resetZoom = () => {
    setZoomDomain(originalDomain)
  }

  const visibleData = chartData.slice(zoomDomain.left, zoomDomain.right + 1)

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Bar Chart - Interactive with Zoom</CardTitle>
          <CardDescription>
            Showing data history. Click and drag to zoom, or use controls.
          </CardDescription>
        </div>
        <div className="flex">
          {["Parameter1", "Parameter2"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">{chartConfig[key].label}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">{total[key].toLocaleString()}</span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {/* Zoom Controls */}
        <div className="flex gap-2 mb-4 justify-end">
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoomDomain.right - zoomDomain.left <= 1}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoomDomain.left === originalDomain.left && zoomDomain.right === originalDomain.right}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            disabled={zoomDomain.left === originalDomain.left && zoomDomain.right === originalDomain.right}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={visibleData}
            margin={{ left: 12, right: 12 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />

            {zoomArea && (
              <ReferenceArea
                x1={chartData[zoomArea.left]?.date}
                x2={chartData[zoomArea.right]?.date}
                strokeOpacity={0.3}
                fillOpacity={0.1}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
