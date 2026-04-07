const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  documentHash: { type: String, required: true, unique: true }, // SHA-256 hash
  fileUrl: { type: String, required: true }, // Server or IPFS path
  issuer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  recipientEmail: { type: String, required: true },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Mapped if recipient registers
  blockchainTxHash: { type: String }, // Transaction hash on smart contract
  status: { type: String, enum: ['issued', 'revoked'], default: 'issued' }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
