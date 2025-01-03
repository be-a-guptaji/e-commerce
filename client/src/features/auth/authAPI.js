import { PATH } from "../../app/constants";

export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(PATH + "/auth/signup/", {
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
      const response = await fetch(PATH + "/auth/login/", {
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
      const response = await fetch(PATH + "/auth/check/", {
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
      const response = await fetch(PATH + "/auth/logout/", {
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
      const response = await fetch(PATH + "/mail/reset-password-request/", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        resolve({ data });
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function resetPassword(information) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(PATH + "/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(information),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        resolve({ data });
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}
