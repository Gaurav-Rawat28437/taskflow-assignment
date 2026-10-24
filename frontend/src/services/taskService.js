
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createTask = async (formData) => {
  const response = await axios.post(
    `${API_URL}/tasks/create`,
    formData,
    { withCredentials: true }
  )

  return response.data
}

export const getAllTasks = async () => {
  const response = await axios.get(
    `${API_URL}/tasks/get-task`,
    { withCredentials: true }
  )

  return response.data
}


export const updateTask = async (taskId, formData) => {
  const response = await axios.put(
    `${API_URL}/tasks/${taskId}`,
    formData,
    { withCredentials: true }
  )

  return response.data
}



export const deleteTask = async (taskId) => {
  const response = await axios.delete(
    `${API_URL}/tasks/${taskId}`,
    { withCredentials: true }
  )

  return response.data
}
