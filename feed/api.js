const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_PER_PAGE = 10;

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.postsPerPage = POSTS_PER_PAGE;
  }

  async fetchPosts(page = 1, searchQuery = "") {
    const params = new URLSearchParams({
      _page: page,
      _limit: this.postsPerPage,
    });

    if (searchQuery) {
      params.append("q", searchQuery);
    }

    const url = `${this.baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      const totalCount = response.headers.get("x-total-count");

      return {
        posts: data,
        totalCount: totalCount ? parseInt(totalCount) : null,
        hasMore: data.length === this.postsPerPage,
      };
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new Error(
          "Connection failed. Please check your internet connection and try again.",
        );
      }
      throw error;
    }
  }
}

const apiService = new ApiService();
