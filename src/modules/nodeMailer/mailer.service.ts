import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, Type } from "@nestjs/common";
import { Types } from "mongoose";
import { Auth } from "../auth/schema/auth.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService : MailerService,
        private readonly configService : ConfigService,
    ){}

    async sendActivateEmail(user_id : Types.ObjectId, email : string){
        try {
            const verificationLink = `${this.configService.get('EMAIL_VERIFY_LINK')}/${user_id}`
            console.log(verificationLink)
            return await this.mailerService.sendMail({
                to : email,
                from : this.configService.get('MAIL')??'',
                subject : 'Email verification',
                text : 'click this button to verify your email on TASKY',
                html : `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p style="color: #555;">Click the button below to verify your email address on <strong>TASKY</strong>.</p>
        <a href="${verificationLink}" 
           style="
             display: inline-block;
             padding: 12px 24px;
             margin: 20px 0;
             font-size: 16px;
             color: #fff;
             background-color: #4CAF50;
             text-decoration: none;
             border-radius: 6px;
           ">
          Verify Email
        </a>
        <p style="color: #888; font-size: 12px;">
          If the button doesn’t work, copy and paste this link into your browser:<br>
          <a href="${verificationLink}" style="color: #4CAF50;">${verificationLink}</a>
        </p>
      </div>
    `
            })
        } catch (error) {
            throw new BadRequestException(`email jo'natishda hatolik : ${error}`)
        }
    }
}