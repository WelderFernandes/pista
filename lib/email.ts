export interface SendEmailParams {
  to: string;
  subject?: string;
  html?: string;
  template?: {
    id: string;
    variables: Record<string, any>;
  };
}

export async function sendEmail({ to, subject, html, template }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Skipping email sending.");
    return;
  }

  try {
    const payload: Record<string, any> = {
      from: fromEmail,
      to: [to],
    };

    if (template) {
      payload.template = template;
    } else {
      payload.subject = subject || "";
      payload.html = html || "";
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Failed to send email via Resend: ${response.status}`, data);
      throw new Error(`Resend error: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    throw error;
  }
}
