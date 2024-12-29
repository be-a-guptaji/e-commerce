export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/brands");
      const data = await response.json();
    resolve({ data });
  });
}

export function createBrand(brand) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/brands/", {
      method: "POST",
      body: JSON.stringify(brand),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
