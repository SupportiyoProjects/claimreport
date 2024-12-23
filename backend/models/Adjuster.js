const adjusterSchema = new mongoose.Schema({
  // ... other fields ...
  supabaseUserId: {
    type: String,
    required: true,
    unique: true
  }
}); 