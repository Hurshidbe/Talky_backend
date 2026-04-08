import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailService } from "./mailer.service";
@Module({
    imports : [
        MailerModule.forRootAsync({
            imports : [ConfigModule],
            inject : [ConfigService],
            useFactory:(config : ConfigService)=>({
                transport : {
                    host : 'smtp.gmail.com',
                    auth : {
                        user : config.get('MAIL'),
                        pass : config.get('MAIL_PASS')
                    }
                }
            })
        })
    ],
    providers : [MailService,ConfigService],
    exports : [MailService]
})
export class MailModule{}