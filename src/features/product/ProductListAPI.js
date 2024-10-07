// A mock function to mimic making an async request for data
export function fetchAllProduct() {
  return new Promise(async (resolve) => {
    const res = await fetch("http://localhost:8080/products");
    const data = await res.json();
    resolve({ data });
  });
}

export function fetchProductsByFilter(filter) {
  let queryString = "";
  
  for (let key in filter.filter) {
    const categoryValue = filter.filter[key];
    if (categoryValue.length) {
      const lastCategoryValue = categoryValue[categoryValue.length - 1];
      queryString += `${key}=${lastCategoryValue}&`;
    }
  }

  if (!(Object.keys(filter.sort).length === 0)) {
    queryString += `_sort=${filter.sort}&`;
  } 
  
  queryString += `_per_page=${filter.pagination._per_page}&`;
  queryString += `_page=${filter.pagination._page}&`;
  
  
  
  return new Promise(async (resolve) => {
    const res = await fetch(`http://localhost:8080/products?${queryString}`);
    const data = await res.json();
    const totalItems = data.items;      
    resolve({ data: { products: data, totalItems :+totalItems} });
  });
}


export function fetchCategory() {
  return new Promise(async (resolve) => {
    const res = await fetch("http://localhost:8080/category");
    const data = await res.json();
    resolve({ data });
  });
}
export function fetchBrands() {
  return new Promise(async (resolve) => {
    const res = await fetch("http://localhost:8080/brands");
    const data = await res.json();
    resolve({ data });
  });
}

export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const res = await fetch(`http://localhost:8080/products?id=${id}`);
    const product = await res.json();
    const data = product[0];
    resolve({ data });
  });
}