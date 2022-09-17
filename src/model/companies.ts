import { Schema, Model, model, Document } from 'mongoose';

export interface Companies extends Document {
  name: string;
  image: string;
}

const CompanySchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true
  },
  image: {
    type: Schema.Types.String,
    required: true
  }
});

const companyModel: Model<Companies> = model<Companies>('Companies', CompanySchema);
export default companyModel;
