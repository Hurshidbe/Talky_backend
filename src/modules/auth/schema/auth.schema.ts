import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Auth {
    @Prop({unique : true})
    email! : string

    @Prop()
    firstname! : string

    @Prop({ type: String, required: false })
    password?: string | null;
//////////////////////////////////////////////////////////////// profile (optional until joining for any project)

    @Prop({required : false})
    lastname? : string

    @Prop({required : false})
    profession? : string

    @Prop({required : false, unique: true})
    username?:string

    @Prop({default : '', required : false})
    about? : string

    @Prop({default : true})
    acces_email_messages! : boolean

    @Prop({required : false, default:null})
    avatar? : string
//////////////////////////////////////////////////////////////// set default only
    @Prop({default : false})
    is_email_verified? : boolean

    @Prop({required : false ,default : null})
    google_id? : string

    @Prop({required : false, default : false})
    is_blocked_user! : boolean
}

export const AuthSchema = SchemaFactory.createForClass(Auth)