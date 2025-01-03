import { PATH } from "../../app/constants";

export function fetchProductById(id) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(PATH + "/products/" + id);
    const data = await response.json();
    if (response.ok) {
      resolve({ data });
    }
    reject(data);
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/products/", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/products/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter, sort, pagination, role) {
  let queryString = "";

  for (let key in filter) {
    const categoryValues = filter[key];
    for (let i = 0; i < categoryValues.length; i++) {
      queryString += `${key}=${categoryValues[i]}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  if (role === "admin") {
    queryString += "admin=true&";
  } else {
    queryString += "admin=false&";
  }

  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/products?" + queryString);
    const data = await response.json();
    const totalItems = data.totalProducts;
    resolve({
      data: { products: { data: data.products }, totalItems: +totalItems },
    });
  });
}
