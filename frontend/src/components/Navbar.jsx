
import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logoutUser } from "../services/authService"

function Navbar() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await logoutUser()
    } catch (error) {
      console.error(
        error.response?.data?.msg || "Logout request failed"
      )
    } finally {
      navigate("/login", { replace: true })
      setLoggingOut(false)
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          TaskFlow
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Show All Tasks
          </NavLink>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
