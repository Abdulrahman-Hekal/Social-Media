// API REQUESTS
// FOR USERS
function getUser(id) {
  showLoading();
  axios
    .get(`${baseUrl}/users/${id}`)
    .then((response) => {
      hideLoading();
      const user = response.data.data;
      profileCard.innerHTML = `
        <main class="profile-card">
          <span style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 2rem;">
            ${
              typeof user.profile_image === "string"
                ? `<img onclick="enlargeImage('${user.profile_image}')" loading="lazy" src="${user.profile_image}" alt="profile image" class="profile-image" style="width: 12rem; height: 12rem;border-radius: 50%;">`
                : `<i class="fa-solid fa-circle-user" style="font-size: 12rem;"></i>`
            }
            <span style="display: flex; flex-direction: column; justify-content: space-between; font-weight: bold; font-size: 2rem;">
              <p>${user.username}</p>
              ${user.name ? `<p>${user.name}</p>` : ""}
              ${user.email ? `<p>${user.email}</p>` : ""}
            </span>
          </span>
          <span style="font-size: 2rem;">
            <p><span style="font-size: 7rem;">${
              user.posts_count
            }</span> Posts</p>
            <p><span style="font-size: 7rem;">${
              user.comments_count
            }</span> Comments</p>
          </span>
        </main>
      `;
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Get User", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
function getUserPosts(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  showLoading();
  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      hideLoading();
      const posts = response.data.data;
      console.log(posts);
      postsContainer.innerHTML = "";
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
        <article class="show-post post" id="${post.id}">
          <header class="post-header">
            <div class="profile" style="cursor: default;">
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
      }
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Fetch User Posts", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
// ANOTHER FUNCTIONS
window.addEventListener("scroll", () => {
  if (scrollY > 1000) {
    document.getElementById("up-btn").style.visibility = "visible";
  }
  if (scrollY < 1000) {
    document.getElementById("up-btn").style.visibility = "hidden";
  }
});
const userID = new URLSearchParams(location.search).get("userID");
setupUI();
getUser(userID);
getUserPosts(userID);
