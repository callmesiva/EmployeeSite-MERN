const express = require("express");
const router = express.Router();
const postData = require("../controller/postControl");
const verifyToken = require("../../middleware/verifyToken");
const { verify } = require("jsonwebtoken");

router.post("/login", postData.login);
router.post("/register", postData.register);
router.post("/store/employee", verifyToken, postData.addEmployee);
router.get("/store/employee", verifyToken, postData.getEmployee);
router.delete("/store/employee/:_id", verifyToken, postData.deleteEmployee);
router.post("/update/employee/:_id", verifyToken, postData.updateEmployee);

module.exports = router;
