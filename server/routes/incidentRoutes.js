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
  const data = await Incident.find();
  res.json(data);
});

module.exports = router;