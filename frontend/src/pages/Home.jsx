
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { createTask } from "../services/taskService"
import { getCurrentUser } from "../services/authService"

function Home() {
  const navigate = useNavigate()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [creatingTask, setCreatingTask] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser()
      } catch {
        navigate("/login", { replace: true })
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setCreatingTask(true)
    setMessage("")
    setError("")

    try {
      const response = await createTask(formData)

      setMessage(response.message || response.msg || "Task created successfully")

      setFormData({
        title: "",
        description: ""
      })
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true })
        return
      }

      setError(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Failed to create task"
      )
    } finally {
      setCreatingTask(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Checking login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to TaskFlow
          </h1>

          <p className="mt-2 text-gray-500">
            Create and organize your tasks in one place.
          </p>
        </div>

        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Create a New Task
          </h2>

          {message && (
            <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                maxLength={100}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description (optional)"
                rows={4}
                maxLength={1000}
                className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={creatingTask}
              className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingTask ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Home
