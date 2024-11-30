export function createUser(userData) {
  return new Promise(async (resolve) => {
    // TODO: on server it will only return some info of user (not password)

    const response = await fetch("http://localhost:8080/auth/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    
    resolve({ data });
  });
}

export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    // TODO: on server it will only return some info of user (not password)

    try {
      const response = await fetch("http://localhost:8080/auth/login/", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        resolve({ data });
      }

      reject(data);
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info
    resolve({ data: "success" });
  });
}
