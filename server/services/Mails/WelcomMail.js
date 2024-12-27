import { sendEMail } from "./SendEMail.js";

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
