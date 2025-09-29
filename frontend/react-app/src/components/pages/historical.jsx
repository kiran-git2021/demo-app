"use client"

import React, { useEffect, useState } from "react"
import { columns } from "../charts/columns"
import { DataTable } from "../charts/data-table"
import {getTableData} from "@/components/APIs/Fetch-API.jsx";
import {API_CONFIG} from "@/components/APIs/config.jsx";

export default function DemoPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await getTableData()
      setData(response)
    }

    fetchData()

  // Refresh every 10 seconds
    const interval = setInterval(fetchData, API_CONFIG.refreshInterval)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

// // You can keep getData outside or import from your API file
// async function getTableData() {
//   // Fetch data from your API here
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     {
//       id: "823hj34k",
//       amount: 250,
//       status: "completed",
//       email: "a@example.com",
//     },
//   ]
// }
