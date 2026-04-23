class Renderer {
  constructor() {
    this.postsContainer = document.querySelector("#posts-container");
    this.loadingIndicator = document.querySelector("#loading-indicator");
    this.errorMessage = document.querySelector("#error-message");
    this.noResults = document.querySelector("#no-results");
    this.endOfResults = document.querySelector("#end-of-results");
  }

  createPostElement(post) {
    const article = document.createElement("article");
    article.className = "post-card";
    article.innerHTML = `
            <div class="post-header">
                <span class="post-id">Post #${post.id}</span>
            </div>
            <h2 class="post-title">${this.escapeHtml(post.title)}</h2>
            <p class="post-body">${this.escapeHtml(post.body)}</p>
        `;
    return article;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  renderPosts(posts, append = false) {
    if (!append) {
      this.postsContainer.innerHTML = "";
      this.hideEndOfResults();
    }

    if (posts.length === 0 && !append) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    const fragment = document.createDocumentFragment();
    posts.forEach((post) => {
      fragment.appendChild(this.createPostElement(post));
    });

    this.postsContainer.appendChild(fragment);
  }

  showLoading() {
    this.loadingIndicator.classList.remove("hidden");
  }

  hideLoading() {
    this.loadingIndicator.classList.add("hidden");
  }

  showError(message) {
    this.errorMessage.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <p>${message}</p>
                <button class="retry-button" onclick="location.reload()">Try Again</button>
            </div>
        `;
    this.errorMessage.classList.remove("hidden");
  }

  hideError() {
    this.errorMessage.classList.add("hidden");
  }

  showNoResults() {
    this.noResults.classList.remove("hidden");
    this.hideEndOfResults();
  }

  hideNoResults() {
    this.noResults.classList.add("hidden");
  }

  showEndOfResults() {
    this.endOfResults.classList.remove("hidden");
  }

  hideEndOfResults() {
    this.endOfResults.classList.add("hidden");
  }

  clearAll() {
    this.postsContainer.innerHTML = "";
    this.hideLoading();
    this.hideError();
    this.hideNoResults();
    this.hideEndOfResults();
  }
}

const renderer = new Renderer();
