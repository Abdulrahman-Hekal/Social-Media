const baseUrl = "https://tarmeezacademy.com/api/v1";
const postsContainer = document.getElementById("posts");
const profile = document.getElementById("profile");
const signingOptions = document.getElementById("signing-options");
const allTagsContainer = document.getElementById("all-tags");
const addPostSection = document.getElementById("add-post-section");
const profileCard = document.getElementById("profile-card");
const welcomeModal = document.getElementById("welcome-modal");
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const postModal = document.getElementById("post-modal");
const deleteModal = document.getElementById("delete-modal");
const imageModal = document.getElementById("image-modal");
const alertModal = document.getElementById("alert");
const isAtHome = addPostSection != null;
const isAtProfile = profileCard != null;
const isAtPost = !isAtHome && !isAtProfile;
// API REQUESTS
// FOR POSTS
function editPost() {
  const postID = document.getElementById("edit-post-id").value;
  const title = document.getElementById("post-modal-title").value;
  const body = document.getElementById("post-modal-body").value;
  const image = document.getElementById("post-modal-image").files[0];
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  let formData = new FormData();
  formData.append("body", body);
  if (title) {
    formData.append("title", title);
  }
  if (image) {
    formData.append("image", image);
  }
  formData.append("_method", "put");
  const headers = { authorization: `Bearer ${token}` };
  showLoading();
  axios
    .post(`${baseUrl}/posts/${postID}`, formData, { headers: headers })
    .then((response) => {
      hideLoading();
      document.getElementById("post-modal-title").value = "";
      document.getElementById("post-modal-body").value = "";
      document.getElementById("post-modal-image").value = "";
      hidePostModal();
      if (isAtHome) {
        getPosts();
      }
      if (isAtPost) {
        getPost(postID);
      }
      if (isAtProfile) {
        getUserPosts(user.id);
      }
      showAlert("You Edited Your Post Successfully.");
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Edit Post", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
function deletePost() {
  const postID = document.getElementById("delete-post-id").value;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = { authorization: `Bearer ${token}` };
  showLoading();
  axios
    .delete(`${baseUrl}/posts/${postID}`, { headers: headers })
    .then((response) => {
      hideLoading();
      hideDeleteModal();
      if (isAtHome) {
        getPosts();
      }
      if (isAtPost) {
        location = "index.html";
      }
      if (isAtProfile) {
        getUserPosts(user.id);
      }
      showAlert("Your Post Was Deleted Successfully.");
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Delete Post", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
// FOR SIGNING
function register() {
  const email = document.getElementById("register-email").value;
  const name = document.getElementById("register-name").value;
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const confirmation = document.getElementById("register-confirmation").value;
  const photo = document.getElementById("register-photo").files[0];
  let formData = new FormData();
  if (password !== confirmation) {
    showAlert("Please, Confirm The Password Correctly.", 1);
    return;
  }
  formData.append("username", username);
  formData.append("password", password);
  if (name) {
    formData.append("name", name);
  }
  if (email) {
    formData.append("email", email);
  }
  if (photo) {
    formData.append("image", photo);
  }
  showLoading();
  axios
    .post(`${baseUrl}/register`, formData)
    .then((response) => {
      hideLoading();
      document.getElementById("register-email").value = "";
      document.getElementById("register-name").value = "";
      document.getElementById("register-username").value = "";
      document.getElementById("register-password").value = "";
      document.getElementById("register-confirmation").value = "";
      document.getElementById("register-photo").value = "";
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      hideRegisterModal();
      setupUI();
      showAlert(`Welcome ${response.data.user.username} To Our Website.`);
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Register", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const bodyParams = { username: username, password: password };
  showLoading();
  axios
    .post(`${baseUrl}/login`, bodyParams)
    .then((response) => {
      hideLoading();
      document.getElementById("login-username").value = "";
      document.getElementById("login-password").value = "";
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      hideLoginModal();
      setupUI();
      if (isAtHome) {
        restartTags();
        getPosts();
      }
      if (isAtPost) {
        const postID = new URLSearchParams(location.search).get("postID");
        getPost(postID);
      }
      showAlert(`Welcome Back, ${response.data.user.username}.`);
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Login", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  if (isAtHome) {
    restartTags();
    getPosts();
  }
  if (isAtPost) {
    const postID = new URLSearchParams(location.search).get("postID");
    getPost(postID);
  }
  if (isAtProfile) {
    location = "index.html";
  }
  showAlert("We Will Miss You, Come Back Soon.");
}
// MODALS CONTROL
function showWelcomeModal() {
  welcomeModal.style.display = "block";
}
function hideWelcomeModal() {
  welcomeModal.style.display = "none";
}
function showLoginModal() {
  loginModal.style.display = "block";
}
function hideLoginModal() {
  loginModal.style.display = "none";
}
function showRegisterModal() {
  registerModal.style.display = "block";
}
function hideRegisterModal() {
  registerModal.style.display = "none";
}
function showPostModal(postObj) {
  const post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("edit-post-id").value = post.id;
  document.getElementById("post-modal-title").value = post.title;
  document.getElementById("post-modal-body").value = post.body;
  postModal.style.display = "block";
}
function hidePostModal() {
  postModal.style.display = "none";
}
function showDeleteModal(postObj) {
  const post = JSON.parse(decodeURIComponent(postObj));
  const author = JSON.parse(localStorage.getItem("user"));
  document.getElementById("delete-post-id").value = post.id;
  document.getElementById("deleted-post").innerHTML = `
    <article class="post" id="${post.id}">
      <header class="post-header">
        <div class="profile" style="cursor: default;">
          ${
            typeof author.profile_image === "string"
              ? `<img loading="lazy" src="${author.profile_image}" alt="profile image" class="profile-image">`
              : `<i class="fa-solid fa-circle-user" style="font-size: 4rem;"></i>`
          }
          <span>${author.username}</span>
        </div>
      </header>
      <hr style="margin: 0 0 1rem -1.5rem;" />
      <main>
        ${post.title !== null ? `<h2>${post.title}</h2>` : ""}
        <p>${post.body}</p>
        ${
          typeof post.image === "string"
            ? `<img loading="lazy" src="${post.image}" alt=" Post Image">`
            : ""
        }
        <div>${post.created_at}</div>
      </main>
      <hr style="margin: 0 0 0 -1.5rem;" />
      <footer style="justify-content: flex-start;">
        <i class="fa-regular fa-message"></i>
        <span>(${post.comments_count}) Comments</span>
        <span id="tags-${post.id}" class="tags"></span>
      </footer>
    </article>
  `;
  deleteModal.style.display = "block";
}
function hideDeleteModal() {
  deleteModal.style.display = "none";
}
function hideImageModal() {
  imageModal.style.display = "none";
}
loginModal.onclick = (e) => {
  if (e.target == loginModal) {
    hideLoginModal();
  }
};
registerModal.onclick = (e) => {
  if (e.target == registerModal) {
    hideRegisterModal();
  }
};
postModal.onclick = (e) => {
  if (e.target == postModal) {
    hidePostModal();
  }
};
deleteModal.onclick = (e) => {
  if (e.target == deleteModal) {
    hideDeleteModal();
  }
};
imageModal.onclick = (e) => {
  if (e.target == imageModal) {
    hideImageModal();
  }
};
function showAlert(message, isError = 0) {
  alertModal.classList.remove("danger");
  if (isError) {
    alertModal.classList.add("danger");
  }
  alertModal.textContent = message;
  alertModal.style.visibility = "visible";
  setTimeout(() => {
    alertModal.style.visibility = "hidden";
  }, 2500);
}
function showLoading() {
  alertModal.classList.remove("danger");
  alertModal.textContent = "";
  alertModal.innerHTML = '<div class="loader"></div>';
  alertModal.style.visibility = "visible";
}
function hideLoading() {
  alertModal.style.visibility = "hidden";
}
// PAGES NAVIGATION
function goToPost(id) {
  location = `post.html?postID=${id}`;
}
function goToProfile(id) {
  location = `profile.html?userID=${id}`;
}
profile.onclick = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    goToProfile(user.id);
  }
};
// ANOTHER FUNCTIONS
function setupUI() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const form = document.getElementById("comment-form");
  if (token) {
    signingOptions.innerHTML = `<button type="button" class="logout-btn" onclick="logout()">Logout</button>`;
    profile.innerHTML = `
    ${
      typeof user.profile_image === "string"
        ? `<img loading="lazy" src="${user.profile_image}" alt="profile image" class="profile-image">`
        : `<i class="fa-solid fa-circle-user" style="font-size: 4rem;"></i>`
    }
      <span>${user.username}</span>
      `;
    profile.style.cursor = "pointer";
    if (isAtHome) {
      addPostSection.innerHTML = `
        <header class="post-header">
          <h1>Add New Post</h1>
          </header>
        <hr>
        <main>
          <form class="post-form">
          <div>
              <label for="post-title">Post Title:</label>
              <input type="text" id="post-title" />
            </div>
            <div>
            <label for="post-body">Post Body:</label>
            <textarea oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' id="post-body"></textarea>
            </div>
            <div>
              <label for="post-image">Post Image:</label>
              <input type="file" id="post-image" />
            </div>
          </form>
        </main>
        <hr style="width: calc(100% + 3rem); margin-left: -1.5rem;" />
        <footer style="display: flex; justify-content: flex-end;">
          <button class="add-post-btn" type="button" onclick="addPost()">Post</button>
        </footer>
      `;
    }
    if (isAtPost) {
      form.style.display = "flex";
    }
  } else {
    signingOptions.innerHTML = `
      <button type="button" onclick="showLoginModal()">Login</button>
      <button type="button" onclick="showRegisterModal()">Register</button>
    `;
    profile.innerHTML = `
      <i class="fa-solid fa-circle-user" style="font-size: 4rem"></i>
      <span>Guest</span>
    `;
    profile.style.cursor = "default";
    if (isAtHome) {
      addPostSection.innerHTML = "";
    }
    if (isAtPost) {
      form.style.display = "none";
    }
  }
}
function restartTags() {
  const allTags = allTagsContainer.children;
  for (const tag of allTags) {
    tag.classList.remove("active");
  }
}
function enlargeImage(url) {
  document.getElementById("image-container").innerHTML = `<img src="${url}" alt="Post Image"/>`;
  imageModal.style.display = "block";
}
function goUp() {
  scrollTo(0, 0);
  document.getElementById("up-btn").style.visibility = "hidden";
}
