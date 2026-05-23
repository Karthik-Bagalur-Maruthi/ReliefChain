const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incident",
  },

  volunteerName: {
    type: String,
    required: true,
  },

  volunteerType: {
    type: String,
    default: "Volunteer",
  },

  taskTitle: {
    type: String,
    required: true,
  },

  severity: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "ASSIGNED",
  },

  latitude: Number,
  longitude: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);