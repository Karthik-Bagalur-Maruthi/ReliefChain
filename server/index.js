const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const incidentRoutes = require("./routes/incidentRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/incidents", incidentRoutes);

app.get("/", (req, res) => {
  res.send("ReliefChain API running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});