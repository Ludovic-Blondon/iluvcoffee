import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Event extends Document {
    @Prop()
    type: string;

    @Prop()
    name: string;

    @Prop({ type: mongoose.SchemaTypes.Mixed })
    payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
