"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A donut chart"

// data uses chart variables directly
const chartData = [
  { browser: "Parameter1", visitors: 275, fill: "var(--chart-1)" }, // almost black
  { browser: "Parameter2", visitors: 200, fill: "var(--chart-2)" }, // dark gray
  { browser: "Parameter3", visitors: 187, fill: "var(--chart-3)" }, // medium gray
  { browser: "Parameter4", visitors: 173, fill: "var(--chart-4)" }, // light gray
  { browser: "other", visitors: 90, fill: "var(--chart-5)" },       // very light gray
]

const chartConfig = {
  visitors: {
    label: "None",
  },
  Parameter1: {
    label: "Parameter1",
    color: "var(--chart-1)",
  },
  Parameter2: {
    label: "Parameter2",
    color: "var(--chart-2)",
  },
  Parameter3: {
    label: "Parameter3",
    color: "var(--chart-3)",
  },
  Parameter4: {
    label: "Parameter4",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}


export function ChartPieDonut() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing total count for the last 6 months</div>
      </CardFooter>
    </Card>
  )
}
