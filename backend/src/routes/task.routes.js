
const express = require("express")
const router = express.Router()

const { taskModel } = require("../models/task.model")
const { isLoggedIn } = require("../middleware/isLoggedIn.middleware")

router.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      })
    }

    const task = await taskModel.create({
      title: title.trim(),
      description: description || "",
      user: req.foundUser._id
    })

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message
    })
  }
})


router.get("/get-task", isLoggedIn, async (req, res) => {
  try {
    const tasks = await taskModel
      .find({ user: req.foundUser._id })
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      data: tasks
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message
    })
  }
})



router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const { title, description, status } = req.body

    const updates = {}

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title is required"
        })
      }

      updates.title = title.trim()
    }

    if (description !== undefined) {
      updates.description = description
    }

    if (status !== undefined) {
      if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status"
        })
      }

      updates.status = status
    }

    const task = await taskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.foundUser._id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    )

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message
    })
  }
})



router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({
      _id: req.params.id,
      user: req.foundUser._id
    })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message
    })
  }
})


module.exports = { taskRouter: router }
