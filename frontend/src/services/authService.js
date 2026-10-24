
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const signupUser = async (formData) => {
  const response = await axios.post(
    `${API_URL}/auth/sign-up`,
    formData,
    { withCredentials: true }
  )

  return response.data
}

export const loginUser = async (formData) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    formData,
    { withCredentials: true }
  )

  return response.data
}

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  )

  return response.data
}

export const getCurrentUser = async () => {
  const response = await axios.get(
    `${API_URL}/auth/get-user-data`,
    { withCredentials: true }
  )

  return response.data
}
