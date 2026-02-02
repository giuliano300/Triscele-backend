import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Inserisci la tua API key Brevo
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendEmailSendInBlue(
    to: string,
    toName: string,
    subject: string,
    body: string,
  ): Promise<boolean> {
    try {
      const staticPortalUrl = process.env.STATIC_PORTAL_URL;
      const senderName = process.env.SENDER_NAME;
      const senderEmail = process.env.SENDER_EMAIL;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const htmlBody = `
      <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#EFEFEF" style="padding:0;margin:0;">
        <tr>
          <td style="width:490px;float:left;padding:5px;">
            <table align="center" cellpadding="0" cellspacing="0" border="0" width="590" bgcolor="#FFFFFF" style="padding:15px 10px;margin:0;line-height:22px;font-size:14px;color:#707070;font-family:Arial, Helvetica, sans-serif;">
              <tr>
                <td colspan="4">
                  <a href="${staticPortalUrl}" target="_blank">
                    <img src="${staticPortalUrl}/images/logo.png" width="110" style="padding:0;float:left;border:0;" />
                  </a>
                  <span style="width:100%;float:left;padding:15px 0 0 0;margin:0 0 15px 0;border-bottom:1px solid #EFEFEF;"></span>
                </td>
              </tr>
              ${body}
              <tr>
                <td colspan="4">
                  <span style="width:100%;float:left;padding:30px 0 0 0;margin:0 0 15px 0;border-bottom:1px solid #EFEFEF;"></span>
                </td>
              </tr>
              <tr>
                <td><strong style="color:#3CBFEA;">TRISCELE S.r.l.</strong></td>
                <td><strong style="color:#3CBFEA;">Telefono</strong></td>
                <td><strong style="color:#3CBFEA;">Email</strong></td>
              </tr>
              <tr>
                <td style="font-size:11px;line-height:16px;">CONTRADA BOVARELLA, 63<br>91018 SALEMI, Trapani</td>
                <td style="font-size:11px;line-height:16px;"><strong>+39 379 19 01 647</strong></td>
                <td style="font-size:11px;line-height:16px;">trisceletp@gmail.com</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
      

      const emailData: SibApiV3Sdk.SendSmtpEmail = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent: body,
      };

      await this.apiInstance.sendTransacEmail(emailData);
      console.log(`✅ Email inviata a ${to}`);
      return true;
    } 
    catch (error) 
    {
      console.error('❌ Errore invio email:', error);
      return false;
    }
  }
}
