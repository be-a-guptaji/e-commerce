export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    const email = loginInfo.email;
    const password = loginInfo.password;
    const response = await fetch("http://localhost:8080/users?email=" + email);
    const data = await response.json();
    if (data.length > 0) {
      if (password === data[0].password) {
        resolve({ data: data[0] });
      } else {
        reject({ message: "Wrong Credentials" });
      }
    } else {
      reject({ message: "Wrong Credentials" });
    }
  });
}

export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export async function updateUser(update) {
  const response = await fetch(`http://localhost:8080/users/${update.id}`);
  const data = await response.json();
  const itemPresence = data.addresses.find(
    (address) => JSON.stringify(address) === JSON.stringify(update.data)
  );

  delete update["data"];

  if (!itemPresence) {
    return new Promise(async (resolve) => {
      const response = await fetch(`http://localhost:8080/users/${update.id}`, {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();
      resolve({ data });
    });
  }
}
