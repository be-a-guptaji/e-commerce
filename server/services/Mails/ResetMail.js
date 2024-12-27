import { sendEMail } from "./SendEMail.js";

export const resetPasswordMail = async ({ email, name, token }) => {
  const resetPasswordInformation = {
    to: email,
    subject: "Reset Password",
    text: "Click the link below to reset your password",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Reset Button</title>
  <style>
    .reset-button {
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
    .reset-button:hover {
      background-color: #45a049;
    }
    .text {
      font-size: 16px;
      color: #333;
      margin-top: 20px;
      line-height: 1.5;
    }
    .highlight {
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <!-- Personalized Greeting with User's Name -->
        <p class="text">
          Hello <strong>${name}</strong>,<br>
          We noticed you may want to reset some of your password. If this is the case, simply click the button below to start the process.
        </p>

        <!-- Reset Button Styled as a Link -->
        <a href="${
          process.env.CLIENT_URL
        }/reset-password?token=${token}&email=${email}" class="reset-button">Reset Password</a>
        
        <!-- Descriptive Text Below the Button -->
        <p class="text">
          By clicking the <span class="highlight">"Reset Password"</span> button above, you'll be redirected to a page where you can modify or restore your settings to their default values. 
          This is a helpful way to start fresh if you've changed your password and wish to return to the original settings.
        </p>

        <p class="text">
          If you have any questions or need assistance, feel free to <span class="highlight">contact our support team</span>. We're here to help!
        </p>
      </td>
    </tr>
  </table>
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