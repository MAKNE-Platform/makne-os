import { transporter } from "./transporter";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await transporter.sendMail({
    from: `"MAKNE" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
