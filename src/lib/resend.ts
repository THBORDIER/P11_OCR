import { Resend } from "resend";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

function requireResend() {
  const client = getResendClient();
  if (!client) {
    throw new Error("RESEND_API_KEY non configurée. Ajoutez-la dans les variables d'environnement.");
  }
  return client;
}

export async function sendQuestionnaireEmail(
  to: string,
  projectName: string,
  questionnaireUrl: string
) {
  return requireResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject: `Questionnaire de cadrage — ${projectName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1e293b; font-size: 24px;">Questionnaire de cadrage</h1>
        <p style="color: #475569; line-height: 1.6;">
          Bonjour,<br><br>
          Vous avez été invité à répondre au questionnaire de cadrage pour le projet <strong>${projectName}</strong>.
        </p>
        <a href="${questionnaireUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Répondre au questionnaire
        </a>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">
          Ce lien est unique et lié à votre projet. Vos réponses seront sauvegardées automatiquement.
        </p>
      </div>
    `,
  });
}

export async function sendNotificationEmail(
  to: string[],
  projectName: string,
  subject: string,
  message: string
) {
  return requireResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject: `[${projectName}] ${subject}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1e293b; font-size: 24px;">${projectName}</h1>
        <p style="color: #475569; line-height: 1.6;">${message}</p>
      </div>
    `,
  });
}
