import mongoose, { Schema, Document, model, Model } from 'mongoose';

export interface Mail extends Document {
  name: string;
  phone: number;
  emailAddress: string;
  message: string;
}

const mailSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    phone: {
      type: Schema.Types.Number,
      required: true
    },
    emailAddress: {
      type: Schema.Types.String,
      required: true
    },
    message: {
      type: Schema.Types.String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const mailModel: Model<Mail> = model<Mail>('Mail', mailSchema);

export default mailModel;
