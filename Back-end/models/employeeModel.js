const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeDataSchema = new Schema({
  userId: Schema.Types.ObjectId,
  empId: String,
  name: String,
  email: String,
  position: String,
  package: String,
});

module.exports = mongoose.model("EmployeeData", employeeDataSchema);
