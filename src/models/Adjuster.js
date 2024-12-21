const adjusterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }], // Reference to Client model
});

const Adjuster = mongoose.model('Adjuster', adjusterSchema); 