// import { sendEMail } from "./SendEMail.js";

// export const confirmationMail = async ({ email, orders }) => {
//   const capitalizeFirstLetter = (string) => {
//     if (!string) {
//       return string;
//     } // Handle empty or undefined strings
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   };

//   const chooseColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-purple-200 text-purple-600";
//       case "dispatched":
//         return "bg-yellow-200 text-yellow-600";
//       case "delivered":
//         return "bg-green-200 text-green-600";
//       case "cancelled":
//         return "bg-red-200 text-red-600";
//       default:
//         return "bg-purple-200 text-purple-600";
//     }
//   };

//   const confirmationMailInformation = {
//     to: email,
//     subject: "Order Placed Successfully",
//     text: "The order has been placed successfully",
//     html: `
//   <html>
//     <head>
//       <style>
//         /* Add all your CSS here */
//         .mx-auto { margin-left: auto; margin-right: auto; }
//         .mt-12 { margin-top: 3rem; }
//         .bg-white { background-color: #ffffff; }
//         .max-w-7xl { max-width: 1280px; }
//         .px-4 { padding-left: 1rem; padding-right: 1rem; }
//         .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
//         .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
//         .rounded-lg { border-radius: 0.5rem; }
//         .border-t { border-top-width: 1px; }
//         .border-gray-200 { border-color: #e5e7eb; }
//         .font-bold { font-weight: 700; }
//         .text-gray-900 { color: #111827; }
//         .text-red-900 { color: #7f1d1d; }
//         .text-green-500 { color: #10b981; }
//         .text-blue-500 { color: #3b82f6; }
//         .text-sm { font-size: 0.875rem; }
//         .text-xl { font-size: 1.25rem; }
//         .rounded-full { border-radius: 9999px; }
//         .object-cover { object-fit: cover; }
//         .object-center { object-position: center; }
//       </style>
//     </head>
//     <body>
//       ${orders.map(
//           (order) => `
//         <div class="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8 rounded-lg">
//           <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
//             <h1 class="text-4xl my-5 font-bold tracking-tight text-gray-900">Order ID # ${
//               order.id
//             }</h1>
//             <div class="flex justify-between">
//               <h3 class="text-xl my-5 font-bold tracking-tight text-red-900">
//                 Order Status: <span class="text-green-500 px-2 py-1 rounded-md">${capitalizeFirstLetter(
//                   order.status
//                 )}</span>
//               </h3>
//               <h3 class="my-5 font-bold tracking-tight text-red-900">
//                 Payment Method: <span class="font-bold text-green-500 bg-green-200 px-2 py-1 rounded-md">${capitalizeFirstLetter(
//                   order.payment.paymentMethod
//                 )}</span>
//               </h3>
//             </div>
//             <div class="flex justify-between">
//               <h3 class="my-5 font-bold tracking-tight text-red-900">
//                 Order Date: <span class="font-bold text-blue-500">${new Date(
//                   order.createdAt
//                 ).toLocaleDateString()} at ${new Date(
//             order.createdAt
//           ).toLocaleTimeString()}</span>
//               </h3>
//               <h3 class="my-5 font-bold tracking-tight text-red-900">
//                 Last Updated: <span class="font-bold text-blue-500">${new Date(
//                   order.createdAt
//                 ).toLocaleDateString()} at ${new Date(
//             order.createdAt
//           ).toLocaleTimeString()}</span>
//               </h3>
//             </div>
//             <div class="flow-root">
//               <ul class="-my-6 divide-y divide-gray-200">
//                 ${order.items
//                   .map(
//                     (item) => `
//                   <li key="${item.id}" class="flex py-6">
//                     <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//                       <img src="${item.product.thumbnail}" alt="${item.product.title}" class="h-full w-full object-cover object-center" />
//                     </div>
//                     <div class="ml-4 flex flex-1 flex-col">
//                       <div class="flex justify-between text-base font-medium text-gray-900">
//                         <h3><a href="/product-detail/${item.product.id}">${item.product.title}</a></h3>
//                         <p class="ml-4">₹ ${item.product.discountedPrice}</p>
//                       </div>
//                       <p class="mt-1 text-sm text-gray-500">${item.product.brand}</p>
//                       <div class="flex flex-1 items-end justify-between mr-5 text-sm font-medium leading-6 text-gray-900">
//                         <div>Qty: ${item.quantity}</div>
//                         <div>Color: <span class="rounded-full" style="background-color: ${item.color};"></span></div>
//                         <div>Size: ${item.size}</div>
//                       </div>
//                     </div>
//                   </li>
//                 `
//                   )
//                   .join("")}
//               </ul>
//             </div>
//           </div>
//           <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
//             <div class="flex justify-between my-2 text-base font-medium text-gray-900">
//               <p>Subtotal</p>
//               <p>₹ ${order.totalAmount}</p>
//             </div>
//             <div class="flex justify-between my-2 text-base font-medium text-gray-900">
//               <p>Total Items in Cart</p>
//               <p>${order.totalItems} items</p>
//             </div>
//             <p class="mt-0.5 text-sm text-gray-500">Shipping Address:</p>
//             <div class="flex justify-between items-center gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 rounded-lg my-4">
//               <div class="flex gap-x-4">
//                 <div class="min-w-0 flex-auto">
//                   <p class="text-sm font-semibold leading-6 text-gray-900">${
//                     order.selectedAddress.name
//                   }</p>
//                 </div>
//               </div>
//               <div class="hidden sm:flex sm:flex-col sm:items-end">
//                 <p class="text-sm leading-6 text-gray-900">${
//                   order.selectedAddress.street
//                 }</p>
//                 <p class="mt-1 truncate text-xs leading-5 text-gray-500">${
//                   order.selectedAddress.pinCode
//                 }</p>
//               </div>
//               <div class="hidden sm:flex sm:flex-col sm:items-end">
//                 <p class="text-sm leading-6 text-gray-900">Phone: ${
//                   order.selectedAddress.phone
//                 }</p>
//                 <p class="text-sm leading-6 text-gray-500">${
//                   order.selectedAddress.city
//                 }</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       `
//         )
//         .join("")}
//     </body>
//   </html>
//   `,
//   };

//   const info = await sendEMail(confirmationMailInformation);

//   if (!info) {
//     return { message: "Error while sending email" };
//   }

//   return { message: "Email sent successfully" };
// };


import { sendEMail } from "./SendEMail.js";

export const confirmationMail = async ({ email, orders }) => {
  console.log("Email: ", email);
  console.log("Orders: ", orders);
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




// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Order Details</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f3f4f6;
//       margin: 0;
//       padding: 0;
//     }
//     .container {
//       max-width: 800px;
//       margin: 0 auto;
//       background-color: #fff;
//       padding: 20px;
//       border-radius: 8px;
//     }
//     .header {
//       font-size: 16px;
//       font-weight: bold;
//       color: #333;
//     }
//     .status {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 16px;
//       color: #333;
//       margin-top: 10px;
//     }
//     .status span {
//       padding: 4px 8px;
//       border-radius: 4px;
//     }
//     .order-info {
//       margin-top: 20px;
//     }
//     .order-info td {
//       padding: 8px 15px;
//       vertical-align: top;
//     }
//     .order-info h3 {
//       font-size: 16px;
//       color: #333;
//     }
//     .order-info p {
//       font-size: 14px;
//       color: #555;
//     }
//     .order-items ul {
//       list-style-type: none;
//       padding: 0;
//       margin: 0;
//     }
//     .order-items li {
//       display: flex;
//       padding: 12px 0;
//       border-bottom: 1px solid #ddd;
//     }
//     .order-items img {
//       width: 80px;
//       height: 80px;
//       object-fit: cover;
//       border-radius: 4px;
//     }
//     .order-items .item-details {
//       margin-left: 15px;
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//     }
//     .order-items .item-details .quantity-price {
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//       font-size: 14px;
//       color: #555;
//     }
//     .order-details {
//       margin-top: 20px;
//     }
//     .order-details p {
//       font-size: 16px;
//       color: #333;
//     }
//     .address {
//       margin-top: 10px;
//       border: 1px solid #ddd;
//       padding: 15px;
//       border-radius: 4px;
//       background-color: #f9f9f9;
//     }
//     .address p {
//       font-size: 14px;
//       color: #555;
//     }
//     .footer {
//       margin-top: 30px;
//       font-size: 12px;
//       color: #aaa;
//       text-align: center;
//     }
//     .btn-container {
//       text-align: center;
//       margin-top: 20px;
//     }
//     .btn {
//       background-color: #4CAF50;
//       color: white;
//       text-decoration: none;
//       padding: 12px 20px;
//       font-size: 16px;
//       border-radius: 5px;
//       display: inline-block;
//     }
//     .btn:hover {
//       background-color: #45a049;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Order ID # ${order.id}</h1>
//     </div>
//     <div class="status">
//       <div>
//         <h3>Order Status:</h3>
//         <span style="background-color: ${chooseColor(
//           order.status
//         )};">${capitalizeFirstLetter(order.status)}</span>
//       </div>
//       <div>
//         <h3>Payment Method:</h3>
//         <p style="color: #28a745; background-color: #e9f9e5; padding: 5px 10px; border-radius: 4px;">${capitalizeFirstLetter(
//           order.payment.paymentMethod
//         )}</p>
//       </div>
//     </div>

//     <div class="order-info">
//       <table width="100%" cellpadding="8" cellspacing="0">
//         <tr>
//           <td width="100%">
//             <h3>Order Date:</h3>
//             <p>${new Date(order.createdAt).toLocaleDateString()} at ${new Date(
//       order.createdAt
//     ).toLocaleTimeString()}</p>
//           </td>
//         </tr>
//       </table>
//     </div>

//     <div class="order-items">
//       <ul>
//         ${order.items
//           .map((item) => {
//             return `
//             <li>
//               <div>
//                 <img src="${item.product.thumbnail}" alt="${
//               item.product.title
//             }">
//               </div>
//               <div class="item-details">
//                 <h3>${item.product.title}</h3>
//                 <p style="color: #555;">${item.product.brand}</p>
//                 <p style="color: #333; font-weight: bold;">₹ ${discountedPrice(
//                   item.product
//                 )}</p>
//                 <div class="quantity-price">
//                   <p>Qty: ${item.quantity}</p>
//                   <p>₹ ${(item.quantity * discountedPrice(item.product)).toFixed(
//                     2
//                   )}</p>
//                 </div>
//               </div>
//             </li>`;
//           })
//           .join("")}
//       </ul>
//     </div>

//     <div class="order-details">
//       <div>
//         <p>Subtotal: $${order.totalAmount}</p>
//         <p>Total Items: ${order.totalItems} items</p>
//       </div>
//       <p>Shipping Address:</p>
//       <div class="address">
//         <p><strong>${order.selectedAddress.name}</strong></p>
//         <p>${order.selectedAddress.street}</p>
//         <p>${order.selectedAddress.pinCode}</p>
//         <p>Phone: ${order.selectedAddress.phone}</p>
//         <p>${order.selectedAddress.city}</p>
//       </div>
//     </div>

//     <!-- Continue Shopping Button -->
//     <div class="btn-container">
//       <a href="${process.env.CLIENT_URL}" class="btn">Continue Shopping</a>
//     </div>

//     <div class="footer">
//       <p>Thank you for your order!</p>
//       <p>If you have any questions, feel free to contact our support team.</p>
//     </div>
//   </div>
// </body>
// </html>