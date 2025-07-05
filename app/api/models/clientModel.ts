import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});

export default mongoose.models.lamp_client || mongoose.model('lamp_client', ClientSchema);