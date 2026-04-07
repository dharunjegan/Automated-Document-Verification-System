const Document = require('../models/Document');
const Organization = require('../models/Organization');
const crypto = require('crypto');
const fs = require('fs');
const { storeDocumentOnBlockchain } = require('../utils/blockchain');

exports.issueDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a document file' });
        }
        
        // Generate SHA-256 hash of the file
        const fileBuffer = fs.readFileSync(req.file.path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const documentHash = hashSum.digest('hex');

        const { title, recipientEmail, organizationId } = req.body;

        // Check verification organization (allow lookup by registrationId "Entity Identifier" or _id)
        let org = await Organization.findOne({ registrationId: organizationId });
        if (!org && organizationId && organizationId.length === 24) {
            org = await Organization.findById(organizationId).catch(() => null);
        }

        if (!org || org.status !== 'approved') {
            return res.status(400).json({ message: 'Invalid or unapproved organization' });
        }

        // Store on Blockchain
        const blockchainTxHash = await storeDocumentOnBlockchain(documentHash);

        const newDoc = await Document.create({
            title,
            documentHash,
            fileUrl: req.file.path,
            issuer: req.user._id,
            organization: org._id,
            recipientEmail,
            blockchainTxHash
        });

        res.status(201).json({ message: 'Document issued successfully', document: newDoc });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

exports.registerOrganization = async (req, res) => {
    const { name, registrationId, address } = req.body;
    try {
        const orgExists = await Organization.findOne({ registrationId });
        if (orgExists) {
            return res.status(400).json({ message: 'Organization already registered' });
        }

        const org = await Organization.create({
            name,
            registrationId,
            address,
            adminUser: req.user._id,
            status: 'pending' // Admin needs to approve
        });
        
        res.status(201).json({ message: 'Organization registration submmited for approval', org });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
