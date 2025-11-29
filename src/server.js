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



app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
