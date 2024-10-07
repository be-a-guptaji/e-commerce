export function fetchLoggedInUserOrders(userId) {
  return new Promise(async (resolve) => {
    const res = await fetch(`http://localhost:8080/orders/?user.id=${userId}`);
    const data = await res.json();
    resolve({ data });
  });
}
