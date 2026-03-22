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
    subject: `${projectName} — Questionnaire de cadrage projet`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- Header gradient -->
        <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:40px 40px 32px;text-align:center;">
          <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="color:#fff;font-size:24px;font-weight:700;">${projectName[0]}</span>
          </div>
          <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">Questionnaire de cadrage</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">${projectName}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="color:#1e293b;font-size:16px;line-height:1.7;margin:0 0 20px;">
            Bonjour,
          </p>
          <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Vous avez été invité(e) à participer au cadrage du projet <strong style="color:#1e293b;">${projectName}</strong>.
            Vos réponses nous permettront de mieux comprendre vos besoins, vos attentes et vos contraintes
            afin de construire un produit parfaitement adapté.
          </p>

          <!-- Info cards -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding-right:8px;">
                <div style="background:#f0f9ff;border-radius:12px;padding:16px;text-align:center;">
                  <div style="font-size:24px;margin-bottom:4px;">&#9200;</div>
                  <div style="color:#0369a1;font-size:13px;font-weight:600;">15 — 20 minutes</div>
                  <div style="color:#64748b;font-size:11px;margin-top:2px;">Temps estimé</div>
                </div>
              </td>
              <td width="50%" style="padding-left:8px;">
                <div style="background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;">
                  <div style="font-size:24px;margin-bottom:4px;">&#128190;</div>
                  <div style="color:#15803d;font-size:13px;font-weight:600;">Sauvegarde auto</div>
                  <div style="color:#64748b;font-size:11px;margin-top:2px;">Reprenez quand vous voulez</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:4px 0 28px;">
              <a href="${questionnaireUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#ffffff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 14px rgba(59,130,246,0.35);">
                Remplir le questionnaire
              </a>
            </td></tr>
          </table>

          <!-- Steps -->
          <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
            <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0 0 12px;">Comment ça se passe ?</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="28" valign="top" style="padding-bottom:10px;">
                  <div style="width:22px;height:22px;background:#3b82f6;border-radius:50%;color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:22px;">1</div>
                </td>
                <td style="padding:2px 0 10px 10px;color:#475569;font-size:13px;line-height:1.5;">
                  <strong style="color:#1e293b;">Identifiez-vous</strong> — votre nom et rôle pour que nous sachions qui répond
                </td>
              </tr>
              <tr>
                <td width="28" valign="top" style="padding-bottom:10px;">
                  <div style="width:22px;height:22px;background:#3b82f6;border-radius:50%;color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:22px;">2</div>
                </td>
                <td style="padding:2px 0 10px 10px;color:#475569;font-size:13px;line-height:1.5;">
                  <strong style="color:#1e293b;">Répondez aux questions</strong> — vos réponses sont sauvegardées automatiquement
                </td>
              </tr>
              <tr>
                <td width="28" valign="top">
                  <div style="width:22px;height:22px;background:#3b82f6;border-radius:50%;color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:22px;">3</div>
                </td>
                <td style="padding:2px 0 0 10px;color:#475569;font-size:13px;line-height:1.5;">
                  <strong style="color:#1e293b;">Validez</strong> — vous pouvez revenir modifier vos réponses à tout moment
                </td>
              </tr>
            </table>
          </div>

          <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
            Plusieurs personnes de votre équipe peuvent répondre au questionnaire avec le même lien.
            Chaque réponse est enregistrée séparément.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">
            Envoyé via <strong style="color:#64748b;">DevTracker</strong> — Outil de suivi de projets
          </p>
          <p style="color:#cbd5e1;font-size:11px;margin:0;">
            Ce message a été envoyé automatiquement. Merci de ne pas y répondre directement.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
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
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:24px 40px;">
          <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">${projectName}</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#1e293b;font-size:18px;margin:0 0 16px;">${subject}</h2>
          <p style="color:#475569;font-size:15px;line-height:1.7;margin:0;">${message}</p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">
            Envoyé via <strong style="color:#64748b;">DevTracker</strong>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
}
