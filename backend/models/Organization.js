const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationId: { type: String, required: true },
  address: { type: String },
  adminUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the org
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
