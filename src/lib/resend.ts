import { Resend } from 'resend'

interface SendEmailParams {
  to: string
  subject: string
  body: string
}

export async function sendEmail({ to, subject, body }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured. Please add it to your environment variables.')
  }

  const resend = new Resend(apiKey)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: subject,
    text: body,
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="white-space: pre-wrap;">${body.replace(/\n/g, '<br>')}</div>
    </div>`,
  })

  if (error) {
    console.error('Resend error:', error)
    throw new Error(error.message)
  }

  return data
}
