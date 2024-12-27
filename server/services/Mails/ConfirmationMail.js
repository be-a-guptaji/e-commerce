import { sendEMail } from "./SendEMail.js";

export const confirmationMail = async ({ email, order }) => {
  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return string;
    } // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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

  const discountedPrice = (item) => {
    return Math.round(item.price * (1 - item.discountPercentage / 100));
  };

  const confirmationMailInformation = {
    to: email,
    subject: "Order Placed Successfully",
    text: "The order has been placed successfully",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Details</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333;
      margin-top: 10px;
    }
    .status span {
      padding: 4px 8px;
      border-radius: 4px;
    }
    .order-info {
      margin-top: 20px;
    }
    .order-info td {
      padding: 8px 15px;
      vertical-align: top;
    }
    .order-info h3 {
      font-size: 16px;
      color: #333;
    }
    .order-info p {
      font-size: 14px;
      color: #555;
    }
    .order-items ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .order-items li {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #ddd;
    }
    .order-items img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    .order-items .item-details {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .order-items .item-details .quantity-price {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 14px;
      color: #555;
    }
    .order-details {
      margin-top: 20px;
    }
    .order-details p {
      font-size: 16px;
      color: #333;
    }
    .address {
      margin-top: 10px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    .address p {
      font-size: 14px;
      color: #555;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }
    .btn-container {
      text-align: center;
      margin-top: 20px;
    }
    .btn {
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 5px;
      display: inline-block;
    }
    .btn:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order ID # ${order.id}</h1>
    </div>
    <div class="status">
      <div>
        <h3>Order Status:</h3>
        <span style="background-color: ${chooseColor(
          order.status
        )};">${capitalizeFirstLetter(order.status)}</span>
      </div>
      <div>
        <h3>Payment Method:</h3>
        <p style="color: #28a745; background-color: #e9f9e5; padding: 5px 10px; border-radius: 4px;">${capitalizeFirstLetter(
          order.payment.paymentMethod
        )}</p>
      </div>
    </div>

    <div class="order-info">
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td width="100%">
            <h3>Order Date:</h3>
            <p>${new Date(order.createdAt).toLocaleDateString()} at ${new Date(
      order.createdAt
    ).toLocaleTimeString()}</p>
          </td>
        </tr>
      </table>
    </div>

    <div class="order-items">
      <ul>
        ${order.items
          .map((item) => {
            return `
            <li>
              <div>
                <img src="${item.product.thumbnail}" alt="${
              item.product.title
            }">
              </div>
              <div class="item-details">
                <h3>${item.product.title}</h3>
                <p style="color: #555;">${item.product.brand}</p>
                <p style="color: #333; font-weight: bold;">$${discountedPrice(
                  item.product
                )}</p>
                <div class="quantity-price">
                  <p>Qty: ${item.quantity}</p>
                  <p>$${(item.quantity * discountedPrice(item.product)).toFixed(
                    2
                  )}</p>
                </div>
              </div>
            </li>`;
          })
          .join("")}
      </ul>
    </div>

    <div class="order-details">
      <div>
        <p>Subtotal: $${order.totalAmount}</p>
        <p>Total Items: ${order.totalItems} items</p>
      </div>
      <p>Shipping Address:</p>
      <div class="address">
        <p><strong>${order.selectedAddress.name}</strong></p>
        <p>${order.selectedAddress.street}</p>
        <p>${order.selectedAddress.pinCode}</p>
        <p>Phone: ${order.selectedAddress.phone}</p>
        <p>${order.selectedAddress.city}</p>
      </div>
    </div>

    <!-- Continue Shopping Button -->
    <div class="btn-container">
      <a href="${process.env.CLIENT_URL}" class="btn">Continue Shopping</a>
    </div>

    <div class="footer">
      <p>Thank you for your order!</p>
      <p>If you have any questions, feel free to contact our support team.</p>
    </div>
  </div>
</body>
</html>
`,
  };

  const info = await sendEMail(confirmationMailInformation);

  if (!info) {
    return { message: "Error while sending email" };
  }

  return { message: "Email sent successfully" };
};
