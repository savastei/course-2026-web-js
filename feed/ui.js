let IntervalAnimation = null;

export function createPostElement(post) {
  const postElement = document.createElement("li");
  const postTitle = document.createElement("h2");
  const postBody = document.createElement("p");

  postTitle.textContent = post.title;
  postBody.textContent = post.body;

  postElement.appendChild(postTitle);
  postElement.appendChild(postBody);
  return postElement;
}

export function renderPosts(container, posts) {
  posts.forEach((post) => {
    container.appendChild(createPostElement(post));
  });
}

export function updateStatus(element, message, isVisible = true) {
  element.textContent = message;
  element.style.display = isVisible ? "block" : "none";
}

export function startLoadingDots(element) {
  if (IntervalAnimation) {
    clearInterval(IntervalAnimation);
  }

  let counter = 0;

  element.style.display = "block";
  element.textContent = "Loading";

  IntervalAnimation = setInterval(() => {
    counter = (counter + 1) % 4;
    element.textContent = "Loading" + ".".repeat(counter);
  }, 400);
}

export function stopLoadingDots() {
  if (IntervalAnimation) {
    clearInterval(IntervalAnimation);
    IntervalAnimation = null;
  }
}

