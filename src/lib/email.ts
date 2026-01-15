import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOtpEmail(
  to: string,
  code: string
) {
  await resend.emails.send({
    from: process.env.OTP_FROM_EMAIL!,
    to,
    subject: "Your Makne verification code",
    html: `
      <div style="font-family: system-ui, sans-serif;">
        <h2>Your verification code</h2>
        <p>Use the code below to verify your email:</p>
        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 16px 0;
        ">
          ${code}
        </div>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
}
