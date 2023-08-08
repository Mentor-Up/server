import { WEBSITE_URL } from '../config';

function sendRegistrationMail(to: string, confirmationCode: string) {
  const from = 'deerdove23@gmail.com';
  const subject = 'Welcome student! - Your account was created';
  const text = registerMailText(to, confirmationCode);
  const html = registerMailHTML(to, confirmationCode);

  return { from, to, subject, text, html };
}

function registerMailText(to: string, confirmationCode: string) {
  return `You account was created. Please visit the website to activate your account, using the following link: ${WEBSITE_URL}/confirmation?code=${confirmationCode}`;
}

function registerMailHTML(to: string, confimationCode: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body style="background-color: #e9ecef;">
    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
      Access the link to confirm your account.
    </div>
  
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Account</h1>
              </td>
            </tr>
          </table>
       </td>
      </tr>
      <!-- end hero -->
  
      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">Tap the button below to confirm your account. If you didn't create an account with <a href="#">MentorUp</a>, you can safely delete this email.</p>
              </td>
            </tr>
            <!-- end copy -->
  
            <!-- start button -->
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                            <a href="${WEBSITE_URL}/confirmation?code=${confimationCode}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm registration</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                <p style="margin: 0;"><a href="${WEBSITE_URL}/confirmation?code=${confimationCode}" target="_blank">"${WEBSITE_URL}/confirmation?code=${confimationCode}"</a></p>
              </td>
            </tr>
            <!-- end copy -->
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                <p style="margin: 0;">Welcome!</p>
              </td>
            </tr>
            <!-- end copy -->
  
          </table>
       </td>
      </tr>
      <!-- end copy block -->
  
      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            <!-- start permission -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                <p style="margin: 0;">You received this email because we received a request to create your account. If you didn't expect this, you can safely delete this email.</p>
              </td>
            </tr>
            <!-- end permission -->
          </table>
        </td>
      </tr>
      <!-- end footer -->
  
    </table>
    <!-- end body -->
  
  </body>
  </html>
  `;
}

export default sendRegistrationMail;
