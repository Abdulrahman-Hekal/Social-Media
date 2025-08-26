// API REQUESTS
// FOR POSTS
function getPost(id) {
  showLoading();
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      hideLoading();
      const post = response.data.data;
      const author = post.author;
      const tags = post.tags;
      const comments = post.comments;
      const user = JSON.parse(localStorage.getItem("user"));
      let showBtns = false;
      if (user) {
        if (user.id === author.id) {
          showBtns = true;
        }
      }
      postsContainer.innerHTML = "";
      let content = `
      <section class="post" id="${post.id}">
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
        <footer>
          <i class="fa-regular fa-message"></i>
          <span>(${post.comments_count}) Comments</span>
          <span id="tags-${post.id}" class="tags"></span>
        </footer>
        <hr style="margin: 0 0 0.5rem -1.5rem; width: calc(100% + 3rem);" />
        <form class="comment-form" id="comment-form">
          <textarea  oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' id="comment-body" placeholder="Write a New Comment"></textarea>
          <button type="button" onclick="addComment(${
            post.id
          })">Comment</button>
        </form>
        <section id="comments"></section>
      </section>
      `;
      postsContainer.innerHTML += content;
      const tagsContainer = document.getElementById(`tags-${post.id}`);
      for (const tag of tags) {
        tagsContainer.innerHTML += `<span class="tag">${tag.name}</span>`;
      }
      const commentsContainer = document.getElementById("comments");
      for (const comment of comments) {
        const author = comment.author;
        commentsContainer.innerHTML += `
          <article class="comment">
            <header>
              ${
                typeof author.profile_image === "string"
                  ? `<img loading="lazy" src="${author.profile_image}" alt="profile image" class="profile-image">`
                  : `<i class="fa-solid fa-circle-user" style="font-size: 4rem;"></i>`
              }
              <span>${author.username}</span>
            </header>
            <main>
              <p>${comment.body}</p>
            </main>
          </article>
        `;
      }
      setupUI();
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Fetch Post", error);
      if (error.response) {
        showAlert(error.response.data.message, 1);
      } else {
        showAlert(error.message, 1);
      }
    });
}
// FOR COMMENTS
function addComment(id) {
  const body = document.getElementById("comment-body").value;
  const token = localStorage.getItem("token");
  const params = {
    body: body,
  };
  const headers = { authorization: `Bearer ${token}` };
  showLoading();
  axios
    .post(`${baseUrl}/posts/${id}/comments`, params, { headers: headers })
    .then((response) => {
      hideLoading();
      document.getElementById("comment-body").value = "";
      getPost(id);
      showAlert("You Just Added Your Touch.");
    })
    .catch((error) => {
      hideLoading();
      console.log("Failed to Comment", error);
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
const postID = new URLSearchParams(location.search).get("postID");
getPost(postID);
