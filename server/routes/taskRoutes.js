import express from "express";

import Task from "../models/Task.js";

const router = express.Router();


// GET TASKS

router.get("/", async (req, res) => {

  try {

    const tasks = await Task.find();

    res.json(tasks);

  } catch {

    res.status(500).json({
      message: "Error fetching tasks",
    });
  }
});


// ADD TASK

router.post("/", async (req, res) => {

  try {

    const newTask = new Task(req.body);

    const savedTask =
      await newTask.save();

    res.json(savedTask);

  } catch {

    res.status(500).json({
      message: "Error adding task",
    });
  }
});


// UPDATE TASK

router.put("/:id", async (req, res) => {

  try {

    const updatedTask =
      await Task.findByIdAndUpdate(

        req.params.id,
        req.body,
        { new: true }

      );

    res.json(updatedTask);

  } catch {

    res.status(500).json({
      message: "Error updating task",
    });
  }
});


// DELETE TASK

router.delete("/:id", async (req, res) => {

  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Task deleted",
    });

  } catch {

    res.status(500).json({
      message: "Error deleting task",
    });
  }
});

export default router;