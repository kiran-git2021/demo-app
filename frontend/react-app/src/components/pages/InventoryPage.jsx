import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"

export default function InventoryPage() {
  const [devices, setDevices] = useState([
    { id: 1, name: "IoT Sensor A", type: "IoT", status: "Active", count: 10 },
    { id: 2, name: "Gateway B", type: "Other", status: "Inactive", count: 2 },
  ])

  const [search, setSearch] = useState("")
  const [newDevice, setNewDevice] = useState({ name: "", type: "", status: "", count: 1 })
  const [editingId, setEditingId] = useState(null)

  // Add device
  const addDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.status) return alert("Fill all fields")
    setDevices([...devices, { ...newDevice, id: Date.now() }])
    setNewDevice({ name: "", type: "", status: "", count: 1 })
  }

  // Delete device
  const deleteDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id))
  }

  // Edit device
  const startEdit = (device) => {
    setEditingId(device.id)
    setNewDevice({ ...device })
  }

  const saveEdit = () => {
    setDevices(devices.map((d) => (d.id === editingId ? newDevice : d)))
    setEditingId(null)
    setNewDevice({ name: "", type: "", status: "", count: 1 })
  }

  // Filter devices
  const filteredDevices = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  // Overview stats
  const totalCount = devices.reduce((sum, d) => sum + Number(d.count), 0)
  const activeCount = devices.filter((d) => d.status === "Active").length
  const inactiveCount = devices.filter((d) => d.status === "Inactive").length
  const faultCount = devices.filter((d) => d.status === "Fault").length

  return (
    <div className="p-6 space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Devices</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{totalCount}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">{activeCount}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inactive</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-600">{inactiveCount}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Fault</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">{faultCount}</CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add/Edit form */}
      <div className="flex gap-2 flex-wrap">
        <Input
          type="text"
          placeholder="Device Name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Type (IoT/Other)"
          value={newDevice.type}
          onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Status (Active/Inactive/Fault)"
          value={newDevice.status}
          onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Count"
          value={newDevice.count}
          onChange={(e) => setNewDevice({ ...newDevice, count: e.target.value })}
        />
        {editingId ? (
          <Button onClick={saveEdit} className="bg-green-600 text-white">Save</Button>
        ) : (
          <Button onClick={addDevice} className="bg-blue-600 text-white">Add</Button>
        )}
      </div>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDevices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.type}</TableCell>
              <TableCell>{device.status}</TableCell>
              <TableCell>{device.count}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-500 text-white"
                  onClick={() => startEdit(device)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 text-white"
                  onClick={() => deleteDevice(device.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
