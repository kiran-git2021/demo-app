import { useState } from "react"
import { Input } from "@/components/ui/input"
import { SlOrganization } from "react-icons/sl"
import { FcOrganization, FcFactory, FcManager } from "react-icons/fc"
import { MdEngineering } from "react-icons/md"
import { FaChalkboardUser } from "react-icons/fa6"
import { TbDeviceAirtag } from "react-icons/tb"
import { GoOrganization } from "react-icons/go"

const icons = {
  Organization: <GoOrganization />,
  OEM: <FcOrganization />,
  Customer: <FcFactory />,
  Manager: <FcManager />,
  Engineer: <MdEngineering />,
  User: <FaChalkboardUser />,
  Device: <TbDeviceAirtag />
}

const initialTree = [
  {
    id: "org-1",
    type: "Organization",
    name: "Organization",
    description: "Main organization",
    children: [
      {
        id: "oem-1",
        type: "OEM",
        name: "OEM 1",
        description: "OEM details",
        children: [
          {
            id: "cust-1",
            type: "Customer",
            name: "Customer A",
            description: "Customer details",
            children: [
              { id: "mgr-1", type: "Manager", name: "Manager 1", description: "Manager details", children: [] },
              { id: "eng-1", type: "Engineer", name: "Engineer 1", description: "Engineer details", children: [] },
              { id: "user-1", type: "User", name: "User 1", description: "User details", children: [] }
            ]
          }
        ]
      }
    ]
  }
]

const generateId = () => Math.random().toString(36).substr(2, 9)

export default function OrganizationTree() {
  const [treeData, setTreeData] = useState(initialTree)
  const [selectedNode, setSelectedNode] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState({})
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="relative pl-6 text-sm">
        {level > 0 && (
          <span
            className="absolute left-2 top-0 bottom-0 border-l border-gray-300 dark:border-gray-600"
            style={{ height: "100%" }}
          />
        )}

        <div className="flex items-center gap-1">
          {node.children?.length > 0 && (
            <button
              onClick={() => toggleExpand(node.id)}
              className="w-4 h-4 flex items-center justify-center text-xs border rounded"
            >
              {expandedNodes[node.id] ? "-" : "+"}
            </button>
          )}
          <div
            className={`p-1 cursor-pointer rounded flex items-center gap-1 ${
              selectedNode?.id === node.id ? "bg-blue-100 dark:bg-blue-800" : ""
            }`}
            onClick={() => setSelectedNode(node)}
          >
            {icons[node.type]} <span>{node.name}</span>
          </div>
        </div>

        {node.children && expandedNodes[node.id] && renderTree(node.children, level + 1)}
      </div>
    ))
  }

  const addChild = (type) => {
    if (!selectedNode) return alert("Select a node first")
    if (!newName) return alert("Enter a name")

    const newNode = {
      id: generateId(),
      type,
      name: newName,
      description: newDescription,
      children: []
    }

    const addNodeRecursively = (nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode.id) {
          node.children = node.children || []
          node.children.push(newNode)
        } else if (node.children) {
          node.children = addNodeRecursively(node.children)
        }
        return node
      })

    setTreeData(addNodeRecursively(treeData))
    setExpandedNodes((prev) => ({ ...prev, [selectedNode.id]: true }))
    setNewName("")
    setNewDescription("")
  }

  const deleteNode = (id) => {
    const removeNodeRecursively = (nodes) =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? removeNodeRecursively(node.children) : []
        }))
    setTreeData(removeNodeRecursively(treeData))
    if (selectedNode?.id === id) setSelectedNode(null)
  }

  return (
    <div className="flex h-screen text-sm">
      {/* Tree */}
      <div className="w-1/3 p-4 border-r border-gray-300 dark:border-gray-600 overflow-y-auto">
        <h2 className="font-bold mb-2">Organization Tree</h2>
        {renderTree(treeData)}
      </div>

      {/* Details */}
      <div className="flex-1 p-4">
        {selectedNode ? (
          <div>
            <h2 className="font-bold text-base flex items-center gap-1">
              {icons[selectedNode.type]} {selectedNode.name} ({selectedNode.type})
            </h2>

            <div className="mt-2 flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Enter name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <div className="flex gap-2 flex-wrap mt-2">
                {/* Conditional Add Buttons */}
                {selectedNode.type === "Organization" && (
                  <button
                    onClick={() => addChild("OEM")}
                    className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: "var(--chart-3)" }}
                  >
                    Add OEM
                  </button>
                )}
                {selectedNode.type === "OEM" && (
                  <button
                    onClick={() => addChild("Customer")}
                    className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: "var(--chart-3)" }}
                  >
                    Add Customer
                  </button>
                )}
                {selectedNode.type === "Customer" && (
                  <>
                    <button
                      onClick={() => addChild("Manager")}
                      className="px-2 py-1 rounded text-white"
                      style={{ backgroundColor: "var(--chart-3)" }}
                    >
                      Add Manager
                    </button>
                    <button
                      onClick={() => addChild("Engineer")}
                      className="px-2 py-1 rounded text-white"
                      style={{ backgroundColor: "var(--chart-3)" }}
                    >
                      Add Engineer
                    </button>
                    <button
                      onClick={() => addChild("User")}
                      className="px-2 py-1 rounded text-white"
                      style={{ backgroundColor: "var(--chart-3)" }}
                    >
                      Add User
                    </button>
                  </>
                )}
                {(selectedNode.type === "Manager" ||
                  selectedNode.type === "Engineer" ||
                  selectedNode.type === "User" ||
                  selectedNode.type === "Customer") && (
                  <button
                    onClick={() => addChild("Device")}
                    className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: "var(--chart-3)" }}
                  >
                    Add Device
                  </button>
                )}

                {/* Delete Button */}
                {selectedNode.type !== "Organization" && (
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: "var(--destructive)" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Show selected node description */}
           <div className="mt-4">
  <label className="font-medium block mb-1">Description:</label>
  <div
    className="border border-gray-300 dark:border-gray-600 rounded p-2"
    style={{
      height: "200px",      // make the box large
      overflowY: "auto",    // allow scrolling if content exceeds
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    }}
  >
    <p className="text-left">
      {selectedNode.description || "No description provided"}
    </p>
  </div>
</div>
          </div>
        ) : (
          <p>Select a node to view details</p>
        )}
      </div>
    </div>
  )
}
