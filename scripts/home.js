let currentPage = 1;
let lastPage = 10;
let currentTagPage = 1;
let lastTagPage = 10;
// API REQUESTS
// FOR POSTS
function getPosts(reload = true, page = 1) {
  showLoading();
  axios
    .get(`${baseUrl}/posts?limit=8&page=${page}`)
    .then((response) => {
      hideLoading();
      const posts = response.data.data;
      const user = JSON.parse(localStorage.getItem("user"));
      lastPage = response.data.meta.last_page;
      if (reload) {
        postsContainer.innerHTML = "";
      }
      let i = 1;
      for (const post of posts) {
        const author = post.author;
        const tags = post.tags;
        let showBtns = false;
        if (user) {
          if (user.id === author.id) {
            showBtns = true;
          }
        }
        let content = `
        <article class="show-post post${i === 2 ? " get-posts" : ""}" id="${
          post.id
        }">
          <header class="post-header">
            <div class="profile" onclick="goToProfile(${author.id})">
              ${
                typeof author.profile_image === "string"
                  ? `<img loading="lazy" src="${author.profile_image}" alt="profile image" class="profile-image">`
                  : `<i class="fa-solid fa-circle-user" style="font-size: 4rem;"></i>`
              }
              <span>${author.username}</span>
            </div>
            ${
              showBtns
                ? `<div class="post-btns">
                    <button class="edit-post" type="button" onclick="showPostModal('${encodeURIComponent(
                      JSON.stringify(post)
                    )}')"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete-post" type="button" onclick="showDeleteModal('${encodeURIComponent(
                      JSON.stringify(post)
                    )}')"><i class="fa-regular fa-trash-can"></i></button>
                  </div>`
                : ""
            }
          </header>
          <hr>
          <main>
            ${post.title !== null ? `<h2>${post.title}</h2>` : ""}
            <p>${post.body}</p>
            ${
              typeof post.image === "string"
                ? `<img onclick="enlargeImage('${post.image}')" loading="lazy" src="${post.image}" alt=" Post Image">`
                : ""
            }
            <div>${post.created_at}</div>
          </main>
          <hr>
          <footer onclick="goToPost(${
            post.id
          })" class="show-parent-post" style="cursor: pointer;">
            <i class="fa-regular fa-message"></i>
            <span>(${post.comments_count}) Comments</span>
            <span id="tags-${post.id}" class="tags"></span>
          </footer>
        </article>
        `;
        postsContainer.innerHTML += content;
        const tagsContainer = document.getElementById(`tags-${post.id}`);
        for (const tag of tags) {
          tagsContainer.innerHTML += `<span class="tag">${tag.name}</span>`;
        }
        i++;
      }
      pagination();
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Fetch Posts", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
function addPost() {
  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const image = document.getElementById("post-image").files[0];
  const token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  if (title) {
    formData.append("title", title);
  }
  if (image) {
    formData.append("image", image);
  }
  const headers = { authorization: `Bearer ${token}` };
  showLoading();
  axios
    .post(`${baseUrl}/posts`, formData, { headers: headers })
    .then((response) => {
      hideLoading();
      document.getElementById("post-title").value = "";
      document.getElementById("post-body").value = "";
      document.getElementById("post-image").value = "";
      getPosts();
      showAlert("You Just Added Your Touch.");
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Post", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
// FOR TAGS
function getTags() {
  axios
    .get(`${baseUrl}/tags`)
    .then((response) => {
      const tags = response.data.data;
      allTagsContainer.innerHTML = "";
      let i = 1;
      for (const tag of tags) {
        allTagsContainer.innerHTML += `
          <span class="tag" id="tag-${i}" onclick="getTagPosts(${i})">${tag.name}</span>
        `;
        i++;
      }
    })
    .catch((error) => {
      console.log("Failed to Fetch Tags", error);
    });
}
function getTagPosts(id, reload = true, isClicked = true, page = 1) {
  showLoading();
  if (isClicked) {
    currentTagPage = 1;
    const isActive = document
      .getElementById(`tag-${id}`)
      .classList.contains("active");
    restartTags();
    if (isActive) {
      location.reload(true);
    } else {
      document.getElementById(`tag-${id}`).classList.add("active");
    }
  }
  axios
    .get(`${baseUrl}/tags/${id}/posts?page=${page}`)
    .then((response) => {
      hideLoading();
      const posts = response.data.data;
      const user = JSON.parse(localStorage.getItem("user"));
      lastTagPage = response.data.meta.last_page;
      if (reload) {
        postsContainer.innerHTML = "";
      }
      let i = 1;
      for (const post of posts) {
        const author = post.author;
        const tags = post.tags;
        let showBtns = false;
        if (user) {
          if (user.id === author.id) {
            showBtns = true;
          }
        }
        let content = `
        <article class="show-post post${i === 2 ? " get-posts" : ""}" id="${
          post.id
        }">
          <header class="post-header">
            <div class="profile" onclick="goToProfile(${author.id})">
              ${
                typeof author.profile_image === "string"
                  ? `<img loading="lazy" src="${author.profile_image}" alt="profile image" class="profile-image">`
                  : `<i class="fa-solid fa-circle-user" style="font-size: 4rem;"></i>`
              }
              <span>${author.username}</span>
            </div>
            ${
              showBtns
                ? `<div class="post-btns">
                    <button class="edit-post" type="button" onclick="showPostModal('${encodeURIComponent(
                      JSON.stringify(post)
                    )}')"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete-post" type="button" onclick="showDeleteModal('${encodeURIComponent(
                      JSON.stringify(post)
                    )}')"><i class="fa-regular fa-trash-can"></i></button>
                  </div>`
                : ""
            }
          </header>
          <hr>
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
          <hr>
          <footer onclick="goToPost(${
            post.id
          })" class="show-parent-post" style="cursor: pointer;">
            <i class="fa-regular fa-message"></i>
            <span>(${post.comments_count}) Comments</span>
            <span id="tags-${post.id}" class="tags"></span>
          </footer>
        </article>
        `;
        postsContainer.innerHTML += content;
        const tagsContainer = document.getElementById(`tags-${post.id}`);
        for (const tag of tags) {
          tagsContainer.innerHTML += `<span class="tag">${tag.name}</span>`;
        }
        i++;
      }
      tagsPagination(id);
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Fetch Tag Posts", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
// ANOTHER FUNCTIONS
function pagination() {
  const observer = new IntersectionObserver((enteries) => {
    enteries.forEach((entry) => {
      if (scrollY > 1000) {
        document.getElementById("up-btn").style.visibility = "visible";
      }
      if (scrollY < 1000) {
        document.getElementById("up-btn").style.visibility = "hidden";
      }
      if (entry.isIntersecting) {
        const post = entry.target;
        if (post.classList.contains("get-posts")) {
          if (lastPage !== currentPage) {
            currentPage++;
            getPosts(false, currentPage);
          }
          post.classList.remove("get-posts");
        }
      }
    });
  }, {});
  const postElements = document.querySelectorAll(".post");
  postElements.forEach((el) => observer.observe(el));
}
function tagsPagination(id) {
  const observer = new IntersectionObserver((enteries) => {
    enteries.forEach((entry) => {
      if (scrollY > 1000) {
        document.getElementById("up-btn").style.visibility = "visible";
      }
      if (scrollY < 1000) {
        document.getElementById("up-btn").style.visibility = "hidden";
      }
      if (entry.isIntersecting) {
        const post = entry.target;
        if (post.classList.contains("get-posts")) {
          if (lastTagPage !== currentTagPage) {
            currentTagPage++;
            getTagPosts(id, false, false, currentTagPage);
          }
          post.classList.remove("get-posts");
        }
      }
    });
  }, {});
  const postElements = document.querySelectorAll(".post");
  postElements.forEach((el) => observer.observe(el));
}
function welcome() {
  const isChecked = document.getElementById("welcome-input").checked;
  if (isChecked) {
    localStorage.setItem("welcome", "false")
  }
  hideWelcomeModal();
}
if (!localStorage.getItem("welcome")) {
  localStorage.setItem("welcome", "true")
}
if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
  location.reload(true);
}
if (performance.getEntriesByType("navigation")[0].type === "navigate") {
  const show = localStorage.getItem("welcome") == "true";
  if (show) {
    showWelcomeModal();
  }
}
setupUI();
getTags();
getPosts();
