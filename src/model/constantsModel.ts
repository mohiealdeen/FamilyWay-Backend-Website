import { Schema, Document, model, Model } from 'mongoose';

export interface Constants extends Document {
  deliveryPrice: {
    high: number;
    low: number;
  };
  order: {
    freeOrder: number;
    midOrder: number;
    minimum: number;
  };
  convertorMoney: {
    pointsToMoney: number;
  };
  invites: number;
  minimum: {
    forPoints: number;
    forWallet: number;
  };
  daysForReturns?: number;
  mobileNumber: number;
  instagram: string;
  giftMessage: string;
  formGift?: number;
  //
  whoUsText?: string;
  usageAgreementText?: string;
  privacyPolicyText?: string;
  commonQuestionsText?: string;
  termsAndConditionsText?: string;
  suggestedToUsText?: string;
  contactUsText?: string;
  //
  order0?: {
    bigText: string;
    title: string;
  };
  order1?: {
    bigText: string;
    title: string;
  };
  order2?: {
    bigText: string;
    title: string;
  };
  order3?: {
    bigText: string;
    title: string;
  };
  order4?: {
    bigText: string;
    title: string;
  };
  order5?: {
    bigText: string;
    title: string;
  };
  order6?: {
    bigText: string;
    title: string;
  };
  order7?: {
    bigText: string;
    title: string;
  };
  order8?: {
    bigText: string;
    title: string;
  };
  canIOrder?: Boolean;
}

const constantsSchema = new Schema(
  {
    deliveryPrice: {
      high: {
        type: Schema.Types.Number,
        required: true
      },
      low: {
        type: Schema.Types.Number,
        required: true
      }
    },
    order: {
      freeOrder: {
        type: Schema.Types.Number,
        required: true
      },
      midOrder: {
        type: Schema.Types.Number,
        required: true
      },
      minimum: {
        type: Schema.Types.Number,
        required: true
      }
    },
    convertorMoney: {
      pointsToMoney: {
        type: Schema.Types.Number,
        required: true
      }
    },
    invites: Schema.Types.Number,
    minimum: {
      forPoints: Schema.Types.Number,
      forWallet: Schema.Types.Number
    },
    mobileNumber: Schema.Types.Number,
    instagram: Schema.Types.String,
    daysForReturns: Schema.Types.Number,
    giftMessage: Schema.Types.String,
    formGift: Schema.Types.Number,
    // privacy
    whoUsText: Schema.Types.String,
    usageAgreementText: Schema.Types.String,
    privacyPolicyText: Schema.Types.String,
    commonQuestionsText: Schema.Types.String,
    termsAndConditionsText: Schema.Types.String,
    suggestedToUsText: Schema.Types.String,
    contactUsText: Schema.Types.String,
    // notification
    order0: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order1: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order2: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order3: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order4: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order5: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order6: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order7: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    order8: {
      bigText: Schema.Types.String,
      title: Schema.Types.String
    },
    canIOrder: Schema.Types.Boolean
  },
  { timestamps: true }
);

const constantsModel: Model<Constants> = model<Constants>('Constants', constantsSchema);

export default constantsModel;
