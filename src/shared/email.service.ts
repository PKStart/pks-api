import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { CustomApiError } from 'pks-common'
import { createTransport, Transporter } from 'nodemailer'
import { DataBackup } from '../users/user.dto'

class EmailData {
  public from = `"P-Kin.com" <${process.env.PK_EMAIL_USER}>`
  constructor(
    public to: string,
    public subject: string,
    public text: string,
    public html: string,
    public attachments?: { filename: string; content: string }[]
  ) {}
}

interface EmailTemplates {
  html: string
  text: string
}

@Injectable()
export class EmailService {
  private readonly transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: process.env.PK_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.PK_EMAIL_USER,
        pass: process.env.PK_EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  public async sendSignupNotification(email: string, name: string) {
    const subject = 'A user signed up to Start'
    const { html, text } = this.getSignupNotificationTemplates(email, name)
    const data = new EmailData(process.env.PK_NOTIFICATION_EMAIL, subject, text, html)
    return await this.sendMail(data)
  }

  public async sendLoginCode(name: string, email: string, loginCode: string): Promise<any> {
    const subject = `${loginCode} - Log in to Start`
    const { html, text } = this.getLoginCodeTemplates(name, loginCode)
    const data = new EmailData(email, subject, text, html)
    return await this.sendMail(data)
  }

  public async sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any> {
    const now = new Date()
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const subject = `Data backup for Start`
    const { html, text } = this.getDataBackupTemplates(name)
    const backupFile = {
      filename: `start-backup-${date}.json`,
      content: JSON.stringify(backup, null, 2),
    }
    const data = new EmailData(email, subject, text, html, [backupFile])
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
    const expiresInMinutes = Number(process.env.PK_LOGIN_CODE_EXPIRY)
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

  private getSignupNotificationTemplates(email: string, name: string) {
    const html = `
    <h3>Hey Peter!</h3>
    <p>A user just signed up to Startpage:</p>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    `
    const text = `
    Hey Peter!
    A user just signed up to Startpage:
    Name: ${name}
    Email: ${email}
    `
    return { html, text }
  }

  private getDataBackupTemplates(name: string) {
    const html = `
    <h3>Hey ${name}!</h3>
    <p>As requested, please find attached the backup file of your Startpage data.</p>
    `
    const text = `
    Hey ${name}!
    As requested, please find attached the backup file of your Startpage data.
    `
    return { html, text }
  }
}
