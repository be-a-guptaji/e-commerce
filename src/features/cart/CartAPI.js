export async function addToCart(items) {
  const inCart = await fetch(`http://localhost:8080/cart?user=${items.user}`);
  const data = await inCart.json();
  const itemPresence = data.find((item) => item.productId === items.productId);

  if (!itemPresence) {
    return new Promise(async (resolve) => {
      const response = await fetch("http://localhost:8080/cart", {
        method: "POST",
        body: JSON.stringify(items),
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();
      resolve({ data });
    });
  }
}

export function fetchItemsById(userId) {
  return new Promise(async (resolve) => {
    const res = await fetch(`http://localhost:8080/cart?user=${userId}`);
    const data = await res.json();
    console.log(data);
    resolve({ data });
  });
}

export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/cart/${update.item}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteItemInCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/cart/${itemId}`, {
      method: "DELETE",
      body: JSON.stringify(itemId),
      headers: { "content-type": "application/json" },
    });
    console.log(itemId);

    const data = await response.json();
    resolve({ data: itemId });
  });
}

export async function resetCart(userid) {
  return new Promise(async (resolve) => {
    const response = await fetchItemsById(userid);
    const data = await response.data;

    for (const item of data) {
      await deleteItemInCart(item.id);
    }

    resolve({ status: "success" });
  });
}
