import { sendEMail } from "./SendEMail.js";

export const confirmationMail = async ({ email, orders }) => {
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to choose color based on order status
  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  // Email information structure
  const confirmationMailInformation = {
    to: email,
    subject: "Order Placed Successfully",
    text: "The order has been placed successfully.",
    html: `
    <html>
      <head>
        <style>
          .mx-auto { margin-left: auto; margin-right: auto; }
          .mt-12 { margin-top: 3rem; }
          .bg-white { background-color: #ffffff; }
          .max-w-7xl { max-width: 1280px; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
          .rounded-lg { border-radius: 0.5rem; }
          .border-t { border-top-width: 1px; }
          .border-gray-200 { border-color: #e5e7eb; }
          .font-bold { font-weight: 700; }
          .text-gray-900 { color: #111827; }
          .text-red-900 { color: #7f1d1d; }
          .text-green-500 { color: #10b981; }
          .text-blue-500 { color: #3b82f6; }
          .text-sm { font-size: 0.875rem; }
          .text-xl { font-size: 1.25rem; }
          .rounded-full { border-radius: 9999px; }
          .object-cover { object-fit: cover; }
          .object-center { object-position: center; }
        </style>
      </head>
      <body>
        ${orders
          .map(
            (order) => `
          <div class="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8 rounded-lg">
            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
              <h1 class="text-4xl my-5 font-bold tracking-tight text-gray-900">Order ID # ${
                order.id
              }</h1>
              <div class="flex justify-between">
                <h3 class="text-xl my-5 font-bold tracking-tight text-red-900">
                  Order Status: <span class="${chooseColor(
                    order.status
                  )} px-2 py-1 rounded-md">${capitalizeFirstLetter(
              order.status
            )}</span>
                </h3>
                <h3 class="my-5 font-bold tracking-tight text-red-900">
                  Payment Method: <span class="font-bold text-green-500 bg-green-200 px-2 py-1 rounded-md">${capitalizeFirstLetter(
                    order.payment.paymentMethod
                  )}</span>
                </h3>
              </div>
              <div class="flex justify-between">
                <h3 class="my-5 font-bold tracking-tight text-red-900">
                  Order Date: <span class="font-bold text-blue-500">${new Date(
                    order.createdAt
                  ).toLocaleDateString()} at ${new Date(
              order.createdAt
            ).toLocaleTimeString()}</span>
                </h3>
                <h3 class="my-5 font-bold tracking-tight text-red-900">
                  Last Updated: <span class="font-bold text-blue-500">${new Date(
                    order.updatedAt
                  ).toLocaleDateString()} at ${new Date(
              order.updatedAt
            ).toLocaleTimeString()}</span>
                </h3>
              </div>
              <div class="flow-root">
                <ul class="-my-6 divide-y divide-gray-200">
                  ${order.items
                    .map(
                      (item) => `
                    <li key="${item.id}" class="flex py-6">
                      <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src="${item.product.thumbnail}" alt="${item.product.title}" class="h-full w-full object-cover object-center" />
                      </div>
                      <div class="ml-4 flex flex-1 flex-col">
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3><a href="/product-detail/${item.product.id}">${item.product.title}</a></h3>
                          <p class="ml-4">₹ ${item.product.discountedPrice}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">${item.product.brand}</p>
                        <div class="flex flex-1 items-end justify-between mr-5 text-sm font-medium leading-6 text-gray-900">
                          <div>Qty: ${item.quantity}</div>
                          <div>Color: <span class="rounded-full" style="background-color: ${item.color};"></span></div>
                          <div>Size: ${item.size}</div>
                        </div>
                      </div>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            </div>
            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div class="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹ ${order.totalAmount}</p>
              </div>
              <div class="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Total Items in Cart</p>
                <p>${order.totalItems} items</p>
              </div>
              <p class="mt-0.5 text-sm text-gray-500">Shipping Address:</p>
              <div class="flex justify-between items-center gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 rounded-lg my-4">
                <div class="flex gap-x-4">
                  <div class="min-w-0 flex-auto">
                    <p class="text-sm font-semibold leading-6 text-gray-900">${
                      order.selectedAddress.name
                    }</p>
                  </div>
                </div>
                <div class="hidden sm:flex sm:flex-col sm:items-end">
                  <p class="text-sm leading-6 text-gray-900">${
                    order.selectedAddress.street
                  }</p>
                  <p class="mt-1 truncate text-xs leading-5 text-gray-500">${
                    order.selectedAddress.pinCode
                  }</p>
                </div>
                <div class="hidden sm:flex sm:flex-col sm:items-end">
                  <p class="text-sm leading-6 text-gray-900">Phone: ${
                    order.selectedAddress.phone
                  }</p>
                  <p class="text-sm leading-6 text-gray-500">${
                    order.selectedAddress.city
                  }</p>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </body>
    </html>
    `,
  };

  try {
    const info = await sendEMail(confirmationMailInformation);

    if (!info) {
      return { message: "Error while sending email" };
    }

    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { message: "Error while sending email" };
  }
};