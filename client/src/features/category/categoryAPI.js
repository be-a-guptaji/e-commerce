export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/category");
    const data = await response.json();
    resolve({ data });
  });
}

export function createCategory(category) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/category", {
      method: "POST",
      body: JSON.stringify(category),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}