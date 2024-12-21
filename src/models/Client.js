import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  // ... existing fields ...
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Adjuster' },
});

export default mongoose.model('Client', clientSchema); 