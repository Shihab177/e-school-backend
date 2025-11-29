const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});
app.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).send({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = req.body;
    user.role = "user";
    user.status = "active";
    console.log(user);
    const result = await User.create(user);
    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    res.status(200).send({
      success: true,
      message: "Login successful",
      result: user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
