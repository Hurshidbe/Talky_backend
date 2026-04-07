import { Module } from '@nestjs/common';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { GoogleStrategy } from './Google.strategy';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports : [PassportModule, ConfigModule],
    providers : [GoogleStrategy],
    exports : [GoogleStrategy]
})
export class GoogleOauth2Module {}
