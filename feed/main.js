import { getPosts } from "./api.js";
import {
  renderPosts,
  updateStatus,
  startLoadingDots,
  stopLoadingDots,
} from "./ui.js";
import { sleep } from "./utils.js";

const T = 500;

const postsContainer = document.querySelector("#posts");
const loadingElement = document.querySelector("#loading");
const observerElement = document.querySelector("#observer-target");
const searchInput = document.querySelector("#search");

let currentPage = 1;
const postsPerPage = 10;
let currentSearch = "";
let praporFetch = false;
let Timer;

async function loadPosts() {
  if (praporFetch) return;
  praporFetch = true;

  startLoadingDots(loadingElement);

  try {
    const results = await Promise.all([
      getPosts(currentPage, postsPerPage, currentSearch),
      sleep(T),
    ]);
    const data = results[0];

    observerElement.style.display =
      data.length < postsPerPage ? "none" : "block";

    if (data.length === 0 && currentPage === 1) {
      stopLoadingDots();
      updateStatus(loadingElement, "No posts found");
      return;
    }

    renderPosts(postsContainer, data);
    stopLoadingDots();
    updateStatus(loadingElement, "", false);
  } catch (error) {
    stopLoadingDots();
    updateStatus(loadingElement, "Error loading");
    console.error(error);
  } finally {
    stopLoadingDots();
    praporFetch = false;
  }
}

const observer = new IntersectionObserver(
  (observs) => {
    const target = observs[0];

    if (target.isIntersecting && !praporFetch) {
      currentPage++;
      loadPosts();
    }
  },
  { rootMargin: "50px" },
);

observer.observe(observerElement);

searchInput.addEventListener("input", (x) => {
  currentSearch = x.target.value;
  clearTimeout(Timer);

  Timer = setTimeout(() => {
    currentPage = 1;
    postsContainer.innerHTML = "";
    loadPosts();
  }, 300);
});

loadPosts();
