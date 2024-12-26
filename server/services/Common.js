import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const cookiesExtractor = (req, res) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};

export const isAuthenticated = (req, res, next) => {
  try {
    const token = cookiesExtractor(req, res);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        req.user = decoded;
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sanitizeUser = (user) => {
  const userObject = user.toObject();

  const id = userObject._id;
  userObject.id = id;

  if (!userObject.addresses) {
    userObject["addresses"] = [];
  }

  delete userObject.password;
  delete userObject.salt;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};

export const sendEMail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter object using your SMTP service or transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your preferred service
      auth: {
        user: process.env.EMAIL_ID, // Ensure you store sensitive info securely
        pass: process.env.EMAIL_PASSWORD, // Environment variables are ideal here
      },
    });

    const info = await transporter.sendMail({
      from: `"E Kart" <${process.env.EMAIL_ID}>'`, // sender address
      to, // recipient address
      subject, // Subject line
      text, // plain text body
      html, // HTML body
    });

    return info;
  } catch (error) {
    return null;
  }
};

export const welcomeMail = async ({ email, name }) => {
  const welcomeInformation = {
    to: email,
    subject: "Welcome to E-Kart Family",
    text: "Welcome to E-Kart Family! This is a plain-text version.",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to E-Kart Family</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header img {
            width: 150px;
            height: auto;
          }
          .greeting {
            font-size: 24px;
            color: #333333;
            margin-bottom: 10px;
          }
          .message {
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
          }
          .cta-button-container {
            text-align: center; /* Center the button container */
            margin-top: 20px;
          }
          .cta-button {
            background-color: #4CAF50; /* Green background */
            border: none;
            color: white;
            padding: 12px 25px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
          }
         .cta-button:hover {
            background-color: #45a049;
           }
          .footer {
            font-size: 12px;
            text-align: center;
            color: #999999;
            margin-top: 40px;
          }
          @media (max-width: 600px) {
            .email-container {
              padding: 15px;
            }
            .greeting {
              font-size: 20px;
            }
            .message {
              font-size: 14px;
            }
            .cta-button {
              font-size: 14px;
              padding: 8px 16px;
            }
          }
        </style>
      </head>
      <body>

        <div class="email-container">
          <!-- Header Section -->
          <div class="header">
            <img src="https://example.com/logo.png" alt="E-Kart Logo">
          </div>

          <!-- Greeting and Message -->
          <div class="content">
            <p class="greeting">Hello, ${name}!</p>
            <p class="message">
              Welcome to the E-Kart family! We're excited to have you on board. At E-Kart, we are committed to providing you with the best shopping experience, whether you're looking for the latest products or fantastic deals.
            </p>
            <p class="message">
              Feel free to explore our website and start shopping today! If you have any questions, don't hesitate to reach out to our customer support team. We&apos;re here to help.
            </p>
            
            <!-- Centered Call to Action Button -->
            <div class="cta-button-container">
              <a href="${process.env.CLIENT_URL}" class="cta-button">Start Shopping</a>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            <p>You're receiving this email because you signed up at E-Kart. If you didn't sign up, please ignore this message.</p>
            <p>Copyright &copy; 2024 E-Kart, All Rights Reserved.</p>
          </div>
        </div>

      </body>
      </html>
    `,
  };

  const info = await sendEMail(welcomeInformation);

  if (!info) {
    return { message: "Error while sending email" };
  }

  return { message: "Email sent successfully" };
};

export const resetPasswordMail = async ({ email, name }) => {
  const resetPasswordInformation = {
    to: email,
    subject: "Reset Password",
    text: "Click the link below to reset your password",
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
      flex-wrap: wrap;  /* Ensures wrapping of title and quantity/price */
    }
    .order-items img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    .order-items .item-details {
      margin-left: 15px;
      flex: 1;  /* Ensures content fills available space */
    }
    .order-items .item-details .item-title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
    .order-items .item-details .quantity-price {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #555;
      margin-top: 5px;
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
                <div class="item-title">
                  <a href=${
                   process.env.CLIENT_URL + "/product-detail/" + item.product._id
                  } style="text-decoration: none; color: #333;" target="_blank">${
              item.product.title
            }</a>
                </div>
                <p style="color: #555;">${item.product.brand}</p>
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

  const info = await sendEMail(resetPasswordInformation);

  if (!info) {
    return { message: "Error while sending email" };
  }

  return { message: "Email sent successfully" };
};

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
    // html: `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <meta charset="UTF-8">
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <title>Order Details</title>
    // <style>
    // body {
    //   font-family: Arial, sans-serif;
    //   background-color: #f3f4f6;
    //   margin: 0;
    //         padding: 0;
    //         }
    //         .container {
    //           max-width: 800px;
    //           margin: 0 auto;
    //           background-color: #fff;
    //           padding: 20px;
    //         border-radius: 8px;
    //         }
    //         .header {
    //           display: flex;
    //           justify-content: space-between;
    //           align-items: center;
    //           }
    //           .header h1 {
    //         font-size: 24px;
    //         font-weight: bold;
    //         color: #333;
    //         }
    //         .status {
    //         font-size: 16px;
    //         color: #333;
    //         margin-top: 10px;
    //         }
    //         .status span {
    //           padding: 4px 8px;
    //           border-radius: 4px;
    //     }
    //     .order-info {
    //       display: flex;
    //       justify-content: space-between;
    //       margin-top: 20px;
    //       }
    //     .order-info h3 {
    //         font-size: 16px;
    //         color: #333;
    //         }
    //         .order-info p {
    //           font-size: 14px;
    //           color: #555;
    //           }
    //     .order-items ul {
    //       list-style-type: none;
    //       padding: 0;
    //       margin: 0;
    //       }
    //       .order-items li {
    //         display: flex;
    //         padding: 12px 0;
    //         border-bottom: 1px solid #ddd;
    //     }
    //     .order-items img {
    //       width: 80px;
    //       height: 80px;
    //       object-fit: cover;
    //       border-radius: 4px;
    //       }
    //       .order-details {
    //         margin-top: 20px;
    //         }
    //         .order-details p {
    //           font-size: 16px;
    //           color: #333;
    //           }
    //           .address {
    //         margin-top: 10px;
    //         border: 1px solid #ddd;
    //         padding: 15px;
    //         border-radius: 4px;
    //         background-color: #f9f9f9;
    //         }
    //         .address p {
    //         font-size: 14px;
    //         color: #555;
    //         }
    //         .footer {
    //           margin-top: 30px;
    //           font-size: 12px;
    //           color: #aaa;
    //         text-align: center;
    //     }
    //     .btn-container {
    //       text-align: center; /* Centers the button */
    //       margin-top: 20px;
    //       }
    //       .btn {
    //         background-color: #4CAF50;
    //         color: white;
    //         text-decoration: none;
    //         padding: 12px 20px;
    //         font-size: 16px;
    //         border-radius: 5px;
    //         display: inline-block;
    //         }
    //         .btn:hover {
    //           background-color: #45a049;
    //           }
    //           </style>
    //           </head>
    //           <body>
    // <div class="container">
    // <div class="header">
    // <h1>Order ID # ${order.id}</h1>
    // </div>
    // <div class="status">
    // <h3>Order Status:</h3>
    // <span style="background-color: ${chooseColor(
    //   order.status
    // )};">${capitalizeFirstLetter(order.status)}</span>
    //           </div>
    //           <div class="order-info">
    //           <div>
    //           <h3>Order Date:</h3>
    //           <p>${new Date(
    //             order.createdAt
    //           ).toLocaleDateString()} at ${new Date(
    //   order.createdAt
    // ).toLocaleTimeString()}</p>
    //               </div>
    //               <div>
    //               <h3>Payment Method:</h3>
    //               <p style="color: #28a745; background-color: #e9f9e5; padding: 5px 10px; border-radius: 4px;">${capitalizeFirstLetter(
    //                 order.payment.paymentMethod
    //               )}</p>
    //                 </div>
    //                 </div>

    //                 <div class="order-items">
    //                 <ul>
    //                 ${order.items
    //                   .map((item) => {
    //                     return `
    //                 <li>
    //                 <div>
    //                         <img src="${item.product.thumbnail}" alt="${
    //                       item.product.title
    //                     }">
    //                           </div>
    //                     <div style="margin-left: 15px;">
    //                     <h3>${item.product.title}</h3>
    //                     <p style="color: #555;">${item.product.brand}</p>
    //                         <p style="color: #333; font-weight: bold;">$${discountedPrice(
    //                           item.product
    //                         )}</p>
    //                           <p>Qty: ${item.quantity}</p>
    //                           </div>
    //                 </li>
    //               `;
    //                   })
    //                   .join("")}
    //         </ul>
    //     </div>

    //     <div class="order-details">
    //     <div>
    //     <p>Subtotal: $${order.totalAmount}</p>
    //     <p>Total Items: ${order.totalItems} items</p>
    //         </div>
    //         <p>Shipping Address:</p>
    //         <div class="address">
    //         <p><strong>${order.selectedAddress.name}</strong></p>
    //         <p>${order.selectedAddress.street}</p>
    //             <p>${order.selectedAddress.pinCode}</p>
    //             <p>Phone: ${order.selectedAddress.phone}</p>
    //             <p>${order.selectedAddress.city}</p>
    //         </div>
    //         </div>

    //         <!-- Continue Shopping Button -->
    //         <div class="btn-container">
    //         <a href="${
    //           process.env.CLIENT_URL
    //         }" class="btn">Continue Shopping</a>
    //           </div>

    //           <div class="footer">
    //           <p>Thank you for your order!</p>
    //           <p>If you have any questions, feel free to contact our support team.</p>
    //           </div>
    //           </div>
    //           </body>
    //           </html>
    //           `,
  };

  const info = await sendEMail(confirmationMailInformation);

  if (!info) {
    return { message: "Error while sending email" };
  }

  return { message: "Email sent successfully" };
};
