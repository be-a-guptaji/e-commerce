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
  <title>Password Reset Success</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    h1 {
      color: #333;
    }
    .content {
      color: #555;
      font-size: 16px;
      line-height: 1.5;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      text-align: center;
      color: #888;
    }
    .btn-container {
      text-align: center; /* Centers the button */
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
    .highlight {
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="header">
      <h1>Password Reset Successful</h1>
    </div>

    <div class="content">
      <p>Dear <span class="highlight">${name}</span>,</p>
      <p>We are pleased to inform you that your password has been successfully reset.</p>
      <p>You can now log in using your new password:</p>

      <p>If you did not request this change, please <a href="${
        process.env.EMAIL_ID
      }">contact our support team</a> immediately.</p>
      
      <p>Thank you for being a valued member of our community!</p>
    </div>

    <div class="btn-container">
      <a href="${process.env.CLIENT_URL}" class="btn">Go to Login</a>
    </div>

    <div class="footer">
      <p>If you need further assistance, please contact us at <a href="${
        process.env.EMAIL_ID
      }">${process.env.EMAIL_ID}</a>.</p>
      <p>&copy; ${new Date().getFullYear()} E-Kart. All rights reserved.</p>
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
