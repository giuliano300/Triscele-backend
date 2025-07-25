import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CourseBooking extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';
}
export const CourseBookingSchema = SchemaFactory.createForClass(CourseBooking);
