const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginModel = require("../../models/loginModel");
const EmployeeData = require("../../models/employeeModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginModel.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await loginModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new loginModel({ email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;

    const newData = new EmployeeData({
      userId: userId,
      empId: req.body.empId,
      name: req.body.name,
      email: req.body.email,
      position: req.body.position,
      package: req.body.package,
    });

    const savedData = await newData.save();
    res.status(200).json(savedData);
  } catch (error) {
    console.error("Error adding employee data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;
    const employeeData = await EmployeeData.find({ userId });
    res.status(201).json(employeeData);
  } catch (error) {
    console.error("Error retrieving employee data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;
    const _id = req.params._id;
    const deletedEmployee = await EmployeeData.findOneAndDelete({
      userId,
      _id,
    });
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const _id = req.params._id;
    const updatedData = req.body;
    const updatedEmployee = await EmployeeData.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee data:", error);
    res.status(500).send("Internal Server Error");
  }
};
