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
  
  // Create RTL-enabled HTML email
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          text-align: right;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
          color: #333333;
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 16px 0;
        }
        .content ul, .content ol {
          margin: 0 0 16px 0;
          padding-right: 20px;
        }
        .content strong {
          font-weight: 600;
        }
        .content em {
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          ${body}
        </div>
      </div>
    </body>
    </html>
  `
  
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: subject,
    html: htmlContent,
  })

  if (error) {
    console.error('Resend error:', error)
    throw new Error(error.message)
  }

  return data
}
