import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Auth {
    @Prop()
    firstname : string

    @Prop({required : false})
    lastname? : string

    @Prop({unique : true, sparse:true, required : false})
    username? : string

    @Prop({unique : true})
    email : string

    @Prop()
    password : string
////////////////////////////////////////////////////////////////
    @Prop({default : false})
    is_email_verified? : boolean

    @Prop({required : false, default : false})
    is_blocked_user : boolean
}

export const AuthSchema = SchemaFactory.createForClass(Auth)