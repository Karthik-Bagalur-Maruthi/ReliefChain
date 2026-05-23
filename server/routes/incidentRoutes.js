const express = require("express");
const router = express.Router();
const Incident = require("../models/Incident");

router.post("/create", async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await Incident.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updatedIncident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* NEW CLEAR ROUTE */
router.delete("/clear", async (req, res) => {
  try {
    await Incident.deleteMany({});

    res.status(200).json({
      message: "All incidents deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

module.exports = router;