import { PATH } from "../../app/constants";

// This function is used to create a new payment
export function initiatePayment(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(PATH + "/payment/initiate", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });

      const paymentDetails = await response.json();

      if (response.ok) {
        resolve(paymentDetails);
      }

      reject(paymentDetails);
    } catch (error) {
      reject(error);
    }
  });
}
