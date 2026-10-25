
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import {
  getAllTasks,
  updateTask,
  deleteTask
} from "../services/taskService"

function AllTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [editForm, setEditForm] = useState({
    title: "",
    description: ""
  })
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasks()
        setTasks(response.data)
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch tasks"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  )

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  )

  const handleEdit = (task) => {
    setEditingTask(task)
    setEditForm({
      title: task.title,
      description: task.description || ""
    })
    setError("")
    setMessage("")
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!editForm.title.trim()) {
      setError("Task title is required")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const response = await updateTask(editingTask._id, {
        title: editForm.title.trim(),
        description: editForm.description
      })

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTask._id
            ? response.data
            : task
        )
      )

      setEditingTask(null)
      setMessage("Task updated successfully")
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update task"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (task) => {
    setUpdatingId(task._id)
    setError("")
    setMessage("")

    const newStatus =
      task.status === "completed" ? "pending" : "completed"

    try {
      const response = await updateTask(task._id, {
        status: newStatus
      })

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id ? response.data : item
        )
      )

      setMessage(
        newStatus === "completed"
          ? "Task marked as completed"
          : "Task marked as pending"
      )
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update status"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    )

    if (!confirmed) return

    setDeletingId(taskId)
    setError("")
    setMessage("")

    try {
      const response = await deleteTask(taskId)

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      )

      setMessage(response.message || "Task deleted successfully")
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete task"
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Tasks
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your tasks
            </p>
          </div>

          <Link
            to="/home"
            className="w-fit rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            + Create Task
          </Link>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Pending Tasks</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingTasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Completed Tasks</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedTasks.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            All Tasks
          </h2>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-lg font-medium text-gray-700">
                No tasks yet
              </p>
              <p className="mt-2 text-gray-500">
                Create your first task to get started.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block font-medium text-indigo-600 hover:text-indigo-700"
              >
                Create a task
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold ${
                        task.status === "completed"
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                      {task.description || "No description"}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      Created:{" "}
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>

                    <span
                      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggleStatus(task)}
                      disabled={
                        updatingId === task._id ||
                        deletingId === task._id
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                        task.status === "completed"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {updatingId === task._id
                        ? "Updating..."
                        : task.status === "completed"
                          ? "Mark Pending"
                          : "Complete"}
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      disabled={
                        deletingId === task._id ||
                        updatingId === task._id
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === task._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Task
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditingTask(null)
                  setError("")
                }}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title: e.target.value
                    })
                  }
                  maxLength={100}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value
                    })
                  }
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter task description"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null)
                    setError("")
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllTasks
