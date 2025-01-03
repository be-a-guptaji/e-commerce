import { PATH } from "../../app/constants";

export function fetchLoggedInUserOrders({ pagination }) {
  let queryString = "";

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve) => {
    const response = await fetch(PATH + `/orders/owner/${queryString}`, {
      credentials: "include",
    });
    const data = await response.json();
    resolve({
      data: {
        orders: data.orders,
        totalOrders: data.totalOrders,
      },
    });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/users/owner", {
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(PATH + "/users/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}
