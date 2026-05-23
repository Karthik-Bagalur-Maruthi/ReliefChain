const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const Incident = require("../models/Incident");

/* ADMIN ASSIGNS TASK */
router.post("/assign", async (req, res) => {
  try {
    console.log("========= ASSIGN HIT =========");
    console.log(req.body);

    const assignment = new Assignment({
      incidentId: req.body.incidentId,
      volunteerName: req.body.volunteerName,
      volunteerType: req.body.volunteerType || "Volunteer",
      taskTitle: req.body.taskTitle,
      severity: req.body.severity,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });

    await assignment.save();

    if (req.body.incidentId) {
      await Incident.findByIdAndUpdate(
        req.body.incidentId,
        { status: "ASSIGNED" },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Task assigned",
      assignment,
    });
  } catch (error) {
    console.log("ASSIGN REAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* VOLUNTEER FETCH TASKS */
router.get("/all", async (req, res) => {
  try {
    const tasks = await Assignment.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.log("GET TASKS ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* MARK TASK COMPLETE + UPDATE LINKED INCIDENT AS RESOLVED */
router.put("/:id/complete", async (req, res) => {
  try {
    console.log("========= COMPLETE TASK HIT =========");
    console.log("TASK ID:", req.params.id);

    const updatedTask = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: "COMPLETED" },
      { new: true }
    );

    console.log("COMPLETED TASK:", updatedTask);

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedIncident = await Incident.findByIdAndUpdate(
      updatedTask.incidentId,
      { status: "RESOLVED" },
      { new: true }
    );

    console.log("UPDATED INCIDENT:", updatedIncident);

    res.json({
      message: "Task completed and incident resolved",
      task: updatedTask,
      incident: updatedIncident,
    });
  } catch (error) {
    console.log("COMPLETE TASK REAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;