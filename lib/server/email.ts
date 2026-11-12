import { roleLabel, type Role } from "@/lib/auth/types";
import { StoreError } from "@/lib/server/errors";

type StaffPasswordEmail = {
  toEmail: string;
  toName: string;
  role: Role;
  password: string;
  loginUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendStaffPassword(input: StaffPasswordEmail) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "SpeciVerse";

  if (!apiKey || !senderEmail) {
    throw new StoreError("Brevo is not configured. Add BREVO_API_KEY and BREVO_SENDER_EMAIL.", 500);
  }

  const role = roleLabel(input.role);
  const text = [
    `Hello ${input.toName},`,
    "",
    `An administrator created your Fieldnotes staff account.`,
    `Role: ${role}`,
    `Email: ${input.toEmail}`,
    `Password: ${input.password}`,
    "",
    `Sign in: ${input.loginUrl}`,
  ].join("\n");

  const html = `
    <p>Hello ${escapeHtml(input.toName)},</p>
    <p>An administrator created your Fieldnotes staff account.</p>
    <p><strong>Role:</strong> ${escapeHtml(role)}<br />
    <strong>Email:</strong> ${escapeHtml(input.toEmail)}<br />
    <strong>Password:</strong> ${escapeHtml(input.password)}</p>
    <p><a href="${escapeHtml(input.loginUrl)}">Sign in to Fieldnotes</a></p>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: input.toEmail, name: input.toName }],
      subject: "Your Fieldnotes staff password",
      textContent: text,
      htmlContent: html,
    }),
  });

  if (response.ok) return;

  const body = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new StoreError(body?.message ?? "Brevo could not send the password email.", 502);
}
