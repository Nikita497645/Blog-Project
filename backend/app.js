console.log("APP FILE LOADED");

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    next();
});
// Middleware FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Model
const Blog = require("./models/Blog");

// Home route
app.get("/", (req, res) => {
    res.send("Server + DB running 🚀");
});

// Create blog route
app.post("/create", async (req, res) => {
    console.log("CREATE API HIT");
    try {
        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content
        });

        await newBlog.save();

        res.send("Blog saved successfully ✅");
    } catch (error) {
        console.log(error);
        res.send("Error saving blog ❌");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});