const Document = require('../models/Document');
const { verifyDocumentOnBlockchain } = require('../utils/blockchain');

exports.verifyDocument = async (req, res) => {
    try {
        const { hash } = req.params;
        const document = await Document.findOne({ documentHash: hash })
            .populate('organization', 'name registrationId status address')
            .populate('issuer', 'name email');

        if (!document) {
            return res.status(404).json({ message: 'Document not found or invalid hash.' });
        }

        const blockchainRecord = await verifyDocumentOnBlockchain(hash);

        res.json({
            message: 'Document Verified',
            document: {
                title: document.title,
                hash: document.documentHash,
                issuedAt: document.createdAt,
                blockchainTx: document.blockchainTxHash,
                organization: document.organization.name,
                issuerName: document.issuer.name,
                status: document.status,
                blockchainVerified: blockchainRecord.isValid,
                blockchainTimestamp: blockchainRecord.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
