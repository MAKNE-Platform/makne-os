import { transporter } from "./transporter";

export async function sendOtpEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"MAKNE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your MAKNE verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
}
