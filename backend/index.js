const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server Running");
    });
  })
  .catch((err) => {
    console.log(err);
  });