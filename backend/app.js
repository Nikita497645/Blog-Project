const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(cors());

// ✅ CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/blogApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ===== MODELS =====
const User = mongoose.model("User", {
  username: String,
  password: String
});

const Blog = mongoose.model("Blog", {
  title: String,
  content: String
});

// ===== SECRET =====
const SECRET = "mysecretkey";

// ===== AUTH MIDDLEWARE =====
function auth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("No token");

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}

// ================= AUTH ROUTES =================

// REGISTER ✅
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashed });
    await user.save();

    res.send("User registered ✅");
  } catch (err) {
    res.status(500).send("Error registering");
  }
});

// LOGIN ✅
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({ token });

  } catch (err) {
    res.status(500).send("Login error");
  }
});

// ================= BLOG ROUTES =================

// GET
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// POST (Protected)
app.post("/blogs", auth, async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.send("Blog created");
});

// PUT
app.put("/blogs/:id", auth, async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated");
});

// DELETE
app.delete("/blogs/:id", auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// ================= SERVER =================
app.listen(8000, () => {
  console.log("Server running on http://127.0.0.1:8000");
});