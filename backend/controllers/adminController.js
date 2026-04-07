const Organization = require('../models/Organization');

exports.getPendingOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find({ status: 'pending' }).populate('adminUser', 'name email');
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveOrganization = async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        org.status = 'approved';
        await org.save();
        res.json({ message: 'Organization approved', org });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectOrganization = async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        org.status = 'rejected';
        await org.save();
        res.json({ message: 'Organization rejected', org });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
