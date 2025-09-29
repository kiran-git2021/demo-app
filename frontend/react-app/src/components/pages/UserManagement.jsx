import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Dummy initial users
const initialUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [editingUser, setEditingUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", role: "" })
  const [confirmDelete, setConfirmDelete] = useState(null) // holds user to delete

  // Open modal for add or edit
  const openForm = (user = null) => {
    setEditingUser(user)
    setFormData(user || { name: "", email: "", role: "" })
    setIsDialogOpen(true)
  }

  // Save user (add or edit)
  const saveUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
    } else {
      setUsers([...users, { id: Date.now(), ...formData }])
    }
    setIsDialogOpen(false)
  }

  // Confirm delete
  const handleDelete = () => {
    if (confirmDelete) {
      setUsers(users.filter((u) => u.id !== confirmDelete.id))
      setConfirmDelete(null)
    }
  }

  // Export as CSV
  const exportCSV = () => {
    const header = ["ID", "Name", "Email", "Role"]
    const rows = users.map((u) => [u.id, u.name, u.email, u.role])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Users Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => openForm()}>Add User</Button>
          <Button variant="outline" onClick={exportCSV}>Export</Button>
        </div>
      </div>

      {/* Confirmation Alert */}
      {confirmDelete && (
        <Alert variant="destructive" className="mb-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <AlertTitle>Confirm Delete</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
            </AlertDescription>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openForm(user)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(user)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit User Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveUser}>{editingUser ? "Update" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
