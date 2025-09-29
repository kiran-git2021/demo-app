// src/api/api.js

import {API_CONFIG} from "@/components/APIs/config.jsx";

const BASE_URL = API_CONFIG.baseUrl  // your FastAPI URL

export async function getStats() {
  try {
    const response = await fetch(`${BASE_URL}/stats`)
    if (!response.ok) throw new Error("Network response was not ok")
    return await response.json()
  } catch (error) {
    console.error("Error fetching stats:", error)
    return []  // fallback empty array
  }
}

export async function getTableData() {
  try {
    const res = await fetch(`${BASE_URL}/table`)
    if (!res.ok) throw new Error("Failed to fetch table data")
    return await res.json()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getBarChartData() {
  try {
    const response = await fetch(`${BASE_URL}/bar-data`)
    if (!response.ok) throw new Error("Network response was not ok")
    return await response.json()
  } catch (error) {
    console.error("Error fetching bar chart data:", error)
    return []
  }
}

export async function getAreaChartData() {
  try {
    const response = await fetch(`${BASE_URL}/area-data`)
    if (!response.ok) throw new Error("Network response was not ok")
    return await response.json()
  } catch (error) {
    console.error("Error fetching area chart data:", error)
    return []
  }
}
