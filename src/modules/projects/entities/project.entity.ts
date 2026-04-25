import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps : true})
export class Project {
    @Prop()
    name!:string

    @Prop()
    owner! : Types.ObjectId

    @Prop({required : false})
    description? : string

    @Prop({type:[String], required : false, default :[]})
    collobrators?: string[]
}

export const ProjectSchema = SchemaFactory.createForClass(Project)