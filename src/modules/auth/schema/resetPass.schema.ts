import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps : true})
export class ResetPass {
    @Prop()
    user! : Types.ObjectId

    @Prop({required : false,default : false})
    used! : boolean
    
    @Prop({
        type: Date, 
        default: () => new Date(Date.now() + 5 * 60 * 1000)})
    expire! :Date
}

export const ResetPassSchema = SchemaFactory.createForClass(ResetPass)