import React, { useState, useEffect } from "react"
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react"
import { Group, SimpleGrid, Text, ThemeIcon, Card } from "@mantine/core"
import classes from "../css/StatsGridIcons.module.css"
import { CardHeader, CardDescription } from "@/components/ui/card"
import { getStats } from "@/components/APIs/Fetch-API.jsx"
import {API_CONFIG} from "@/components/APIs/config.jsx";

export function StatsGridIcons() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    async function fetchStats() {
      const data = await getStats()
      setStats(data)
    }
    // Initial fetch
    fetchStats()

    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, API_CONFIG.refreshInterval)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {stats.map((stat) => {
          const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight
          const diffColor = stat.diff > 0 ? "teal" : "red"
          const iconColor = stat.diff > 0 ? "var(--mantine-color-teal-6)" : "var(--mantine-color-red-6)"

          return (
            <Card
              key={stat.title}
              className={`${classes.Card} w-full max-w-sm`}
              shadow="sm"
              p="md"
              radius="md"
            >
              <CardHeader className="flex flex-col gap-2">
                <Group position="apart">
                  <div>
                    <Text
                      c="dimmed"
                      tt="uppercase"
                      fw={700}
                      fz="xs"
                      className={classes.label}
                    >
                      {stat.title}
                    </Text>
                    <Text fw={700} fz="xl">
                      {stat.value}
                    </Text>
                  </div>
                  <ThemeIcon
                    color={diffColor}
                    variant="light"
                    size={38}
                    radius="md"
                    style={{ color: iconColor }}
                  >
                    <DiffIcon size={28} stroke={1.5} />
                  </ThemeIcon>
                </Group>
                <CardDescription>
                  <Text c="dimmed" fz="sm" mt="md">
                    <Text component="span" c={diffColor} fw={700}>
                      {Math.abs(stat.diff)}%
                    </Text>{" "}
                    {stat.diff > 0 ? "increase" : "decrease"} compared to last month
                  </Text>
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </SimpleGrid>
    </div>
  )
}
