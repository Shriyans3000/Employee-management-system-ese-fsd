const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  department: String,

  skills: [String],

  performanceScore: Number,

  experience: Number,
});

module.exports = mongoose.model("Employee", employeeSchema);