export async function getPosts(page, limit, search) {
  const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}&q=${encodeURIComponent(search)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Server error");
  }

  return response.json();
}
