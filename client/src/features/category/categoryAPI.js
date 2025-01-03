import { PATH } from "../../app/constants";

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/category");
    const data = await response.json();
    resolve({ data });
  });
}

export function createCategory(category) {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/category", {
      method: "POST",
      body: JSON.stringify(category),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
