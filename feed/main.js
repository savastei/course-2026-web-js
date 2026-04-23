class PostFeedApp {
  constructor() {
    this.searchInput = document.querySelector("#search-input");
    this.sentinel = document.querySelector("#sentinel");

    this.currentPage = 1;
    this.currentSearchQuery = "";
    this.isLoading = false;
    this.hasMorePosts = true;
    this.debounceTimer = null;
    this.observer = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.loadInitialPosts();
  }

  setupEventListeners() {
    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300);
    });
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoading && this.hasMorePosts) {
            console.log("Loading more posts...");
            this.loadMorePosts();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    this.observer.observe(this.sentinel);
  }

  async handleSearch(query) {
    this.currentSearchQuery = query;
    this.currentPage = 1;
    this.hasMorePosts = true;

    renderer.clearAll();

    await this.fetchAndRenderPosts(false);
  }

  async loadInitialPosts() {
    renderer.showLoading();
    await this.fetchAndRenderPosts(false);
  }

  async loadMorePosts() {
    if (this.isLoading || !this.hasMorePosts) return;

    this.currentPage++;
    console.log(`Fetching page ${this.currentPage}...`);
    await this.fetchAndRenderPosts(true);
  }

  async fetchAndRenderPosts(append = false) {
    this.isLoading = true;
    renderer.showLoading();
    renderer.hideError();

    try {
      const result = await apiService.fetchPosts(
        this.currentPage,
        this.currentSearchQuery,
      );

      if (result.posts.length > 0) {
        renderer.renderPosts(result.posts, append);
        this.hasMorePosts = result.hasMore;

        if (!this.hasMorePosts) {
          renderer.showEndOfResults();
        }
      } else {
        if (!append) {
          renderer.renderPosts([], false);
        }
        this.hasMorePosts = false;
      }

      console.log(
        `Loaded ${result.posts.length} posts from page ${this.currentPage}`,
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      renderer.showError(error.message || "An unexpected error occurred");

      if (append) {
        this.currentPage--;
      }
    } finally {
      this.isLoading = false;
      renderer.hideLoading();

      if (!this.hasMorePosts) {
        this.observer.unobserve(this.sentinel);
        console.log("No more posts to load");
      } else {
        this.observer.observe(this.sentinel);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PostFeedApp();
  console.log("Post Feed App initialized");
});
