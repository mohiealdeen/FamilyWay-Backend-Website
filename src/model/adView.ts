import { Schema, Document, Model, model } from 'mongoose';

export interface AdView extends Document {
  image: string;
  isTimer?: Boolean;
  time?: number;
}

const adViewSchema = new Schema({
  image: {
    type: Schema.Types.String,
    required: true
  },
  isTimer: { type: Schema.Types.Boolean, default: false },
  time: { type: Schema.Types.Number }
});

const adViewModel: Model<AdView> = model<AdView>('AdView', adViewSchema);

export default adViewModel;
