const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'issuer', 'user', 'verifier'], 
    default: 'user' 
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // For issuers
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
