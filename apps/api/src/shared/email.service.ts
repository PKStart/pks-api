import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { CustomApiError } from '@pk-start/common'
import { createTransport, Transporter } from 'nodemailer'

class EmailData {
  public from = `"P-Kin.com" <${process.env.PK_EMAIL_USER}>`
  constructor(
    public to: string,
    public subject: string,
    public text: string,
    public html: string
  ) {}
}

interface EmailTemplates {
  html: string
  text: string
}

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.PK_EMAIL_USER,
        pass: process.env.PK_EMAIL_PASS,
      },
    })
  }

  async sendPasswordResetEmail(name: string, email: string, loginCode: string): Promise<any> {
    const subject = 'Log in to Start'
    const { html, text } = this.getLoginCodeTemplates(name, loginCode)
    const data = new EmailData(email, subject, text, html)
    return await this.sendMail(data)
  }

  private async sendMail(emailData: EmailData): Promise<any> {
    try {
      return await this.transporter.sendMail(emailData)
    } catch (error) {
      throw new ServiceUnavailableException(CustomApiError.UNABLE_TO_SEND, error)
    }
  }

  private getLoginCodeTemplates(name: string, loginCode: string): EmailTemplates {
    const expiresInMinutes = Number(process.env.PK_LOGIN_CODE_EXPIRES) / 60
    const html = `
    <h3>Hello ${name}!</h3>
    <p>Please use the code below to log in, it expires in ${expiresInMinutes} minutes.</p>
    <h1>${loginCode}</h1>
    `
    const text = `
    Hello ${name}!
    Your code to log in: ${loginCode}.
    You can use it within the next ${expiresInMinutes} minutes.
    `
    return { html, text }
  }
}
