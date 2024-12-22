import mongoose from 'mongoose';

const adjusterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  supabaseUserId: { type: String, required: true, unique: true },
  progress: { type: String, default: 'Initial' },
  clients: [{
    type: new mongoose.Schema({
      insured: {
        insuredFirstName: String,
        insuredLastName: String,
        propertyType: String,
        primaryPhone: String,
        secondaryPhone: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isInspectionAtAddress: String,
        addPOC: Boolean,
        progress: String,
      },
      claim: {
        claimNumber: String,
        dateOfLoss: Date,
        typeOfLoss: String,
        lossDescription: String,
        carrierEmail: String,
        clientInstructions: String,
        addBillingContact: Boolean,
        specialInstructions: Object,
      },
      completionDate: { type: Date, default: null },
    }),
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Adjuster', adjusterSchema); 