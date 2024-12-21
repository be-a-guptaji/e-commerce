export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8080/auth/signup/", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "content-type": "application/json" },
        credentials: "include",
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

export function logginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login/", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const data = await response.text();
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function checkAuth(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8080/auth/check/", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const data = await response.text();
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout/", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        resolve({ data: "success" });
      }

      reject({ data: "error" });
    } catch (error) {
      reject(error);
    }
  });
}

export function requestResetPassword(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        "http://localhost:8080/mail/reset-password-request/",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "content-type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const data = await response.text();
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}
