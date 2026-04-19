console.log("SERVER STARTING 🚀");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));// VERY IMPORTANT (fixes CORS error)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// ✅ Model
const Blog = require("./models/Blog");

// ================= ROUTES ================= //

// HOME
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// 🔹 GET ALL BLOGS
app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🔹 CREATE BLOG
app.post("/blogs", async (req, res) => {
    try {
        const blog = new Blog({
            title: req.body.title,
            content: req.body.content
        });

        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🔹 UPDATE BLOG
app.put("/blogs/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            { new: true }
        );

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🔹 DELETE BLOG
app.delete("/blogs/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted ✅" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ================= SERVER ================= //

app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});