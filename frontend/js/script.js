const API = "http://127.0.0.1:8000/blogs";

// LOAD BLOGS
async function loadBlogs() {
  try {
    const res = await fetch(API);
    console.log("Status:", res.status);

    const blogs = await res.json();

    const list = document.getElementById("blogList");
    list.innerHTML = "";

    blogs.forEach(blog => {
      list.innerHTML += `
        <div class="blog-card">
          <h3>${blog.title}</h3>
          <p>${blog.content.substring(0, 120)}...</p>

          <button onclick="editBlog('${blog._id}', \`${blog.title}\`, \`${blog.content}\`)">
            Edit
          </button>

          <button onclick="deleteBlog('${blog._id}')">
            Delete
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error("LOAD ERROR:", error);
    alert("Backend not connected ❌");
  }
}

// CREATE / UPDATE
async function submitBlog() {
  try {
    const id = document.getElementById("blogId").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const data = { title, content };

    if (id) {
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    // Clear form
    document.getElementById("blogId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadBlogs();

  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    alert("Error saving blog ❌");
  }
}

// EDIT
function editBlog(id, title, content) {
  document.getElementById("blogId").value = id;
  document.getElementById("title").value = title;
  document.getElementById("content").value = content;
}

// DELETE
async function deleteBlog(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    loadBlogs();

  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
}

// INIT
loadBlogs();