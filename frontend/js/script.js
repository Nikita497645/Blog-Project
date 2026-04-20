const API = "http://127.0.0.1:8000/blogs";

// ================= AUTH CHECK =================
function getToken() {
  return localStorage.getItem("token");
}

// 🔒 Redirect if not logged in
if (!getToken()) {
  alert("Please login first 🔐");
  window.location.href = "login.html";
}

// ================= LOAD BLOGS =================
async function loadBlogs() {
  try {
    const res = await fetch(API);
    const blogs = await res.json();

    const list = document.getElementById("blogList");
    list.innerHTML = "";

    if (blogs.length === 0) {
      list.innerHTML = "<p>No blogs yet 😢</p>";
      return;
    }

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

// ================= CREATE / UPDATE =================
async function submitBlog() {
  const btn = document.getElementById("submitBtn");

  try {
    btn.innerText = "Publishing...";
    btn.disabled = true;

    const id = document.getElementById("blogId").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const data = { title, content };

    if (id) {
      // UPDATE
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getToken()
        },
        body: JSON.stringify(data)
      });
    } else {
      // CREATE
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getToken()
        },
        body: JSON.stringify(data)
      });
    }

    alert("Blog saved ✅");

    // Clear form
    document.getElementById("blogId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadBlogs();

  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    alert("Error saving blog ❌");
  } finally {
    btn.innerText = "Publish Blog";
    btn.disabled = false;
  }
}

// ================= EDIT =================
function editBlog(id, title, content) {
  document.getElementById("blogId").value = id;
  document.getElementById("title").value = title;
  document.getElementById("content").value = content;
}

// ================= DELETE =================
async function deleteBlog(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": getToken()
      }
    });

    loadBlogs();

  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  alert("Logged out 👋");
  window.location.href = "login.html";
}

// ================= INIT =================
loadBlogs();