const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  disasterType: String,
  severity: String,
  resources: String,
  latitude: Number,
  longitude: Number,
  image: String,
  syncStatus: {
    type: String,
    default: "Completed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Incident", incidentSchema);