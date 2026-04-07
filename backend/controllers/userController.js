const Document = require('../models/Document');
const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

exports.getMyDocuments = async (req, res) => {
    try {
        // Find documents issued specifically to this user's email
        const documents = await Document.find({ recipientEmail: req.user.email })
            .populate('organization', 'name')
            .populate('issuer', 'name email');
            
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get stats based on role
        let stats = {};
        if (user.role === 'user') {
            stats.documentsReceived = await Document.countDocuments({ recipientEmail: user.email });
        } else if (user.role === 'issuer') {
            stats.documentsIssued = await Document.countDocuments({ issuer: user._id });
            stats.organizationsRegistered = await Organization.countDocuments({ adminUser: user._id });
        } else if (user.role === 'admin') {
            stats.totalUsers = await User.countDocuments();
            stats.totalDocuments = await Document.countDocuments();
            stats.totalOrganizations = await Organization.countDocuments();
            stats.pendingOrganizations = await Organization.countDocuments({ status: 'pending' });
        }

        res.json({ user, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, currentPassword, newPassword } = req.body;

        // Update name
        if (name) user.name = name;

        // Update email (check for duplicates)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        // Update password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
