import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserCircle, FaEnvelope, FaShieldAlt, FaPen, FaSave, FaTimes, 
  FaLock, FaCalendarAlt, FaFileAlt, FaBuilding, FaUsers, FaClock,
  FaCheckCircle, FaKey, FaEye, FaEyeSlash 
} from 'react-icons/fa';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.user);
      setStats(res.data.stats);
      setEditForm({ name: res.data.user.name, email: res.data.user.email });
    } catch (err) {
      toast.error('Failed to load profile', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.put('http://localhost:5000/api/user/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local storage and context
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, name: res.data.name, email: res.data.email };
      login(updatedUser);
      setProfile(prev => ({ ...prev, name: res.data.name, email: res.data.email }));
      setEditing(false);
      toast.success('Profile updated successfully!', { theme: 'dark' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile', { theme: 'dark' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match', { theme: 'dark' });
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters', { theme: 'dark' });
    }
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.put('http://localhost:5000/api/user/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      toast.success('Password changed successfully!', { theme: 'dark' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password', { theme: 'dark' });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'from-emerald-400 to-teal-500',
      issuer: 'from-fuchsia-400 to-indigo-500',
      user: 'from-indigo-400 to-violet-500',
      verifier: 'from-amber-400 to-orange-500'
    };
    return colors[role] || colors.user;
  };

  const getRoleGlow = (role) => {
    const glows = {
      admin: 'shadow-emerald-500/20',
      issuer: 'shadow-fuchsia-500/20',
      user: 'shadow-indigo-500/20',
      verifier: 'shadow-amber-500/20'
    };
    return glows[role] || glows.user;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return <div className="p-10 text-center text-white">Please login to view your profile</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-mono tracking-widest text-sm animate-pulse">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      {/* Background Blobs */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Header */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-black text-white tracking-tight mb-3"
        >
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 text-glow">Profile</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl"
        >
          Manage your account details and security settings.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card – Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className={`glass-card p-8 text-center relative overflow-hidden shadow-xl ${getRoleGlow(profile?.role)}`}>
            {/* Top Banner Gradient */}
            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${getRoleBadge(profile?.role)} opacity-20`}></div>
            
            {/* Avatar */}
            <div className="relative z-10 mt-4 mb-6">
              <div className={`w-28 h-28 bg-gradient-to-br ${getRoleBadge(profile?.role)} rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-4 border-white/10`}>
                <span className="text-4xl font-black text-white">{getInitials(profile?.name)}</span>
              </div>
            </div>

            {/* Name & Email */}
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.name}</h2>
            <p className="text-slate-400 text-sm mb-4 flex items-center justify-center space-x-2">
              <FaEnvelope className="text-xs" />
              <span>{profile?.email}</span>
            </p>

            {/* Role Badge */}
            <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getRoleBadge(profile?.role)} px-4 py-1.5 rounded-full text-white text-xs font-black tracking-widest uppercase shadow-lg mb-6`}>
              <FaShieldAlt />
              <span>{profile?.role}</span>
            </div>

            {/* Member Since */}
            <div className="border-t border-white/10 pt-4 mt-2">
              <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
                <FaCalendarAlt className="text-indigo-400" />
                <span>Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-4"
          >
            {profile?.role === 'user' && (
              <StatCard icon={<FaFileAlt />} label="Documents Received" value={stats.documentsReceived || 0} color="indigo" />
            )}
            {profile?.role === 'issuer' && (
              <>
                <StatCard icon={<FaFileAlt />} label="Documents Issued" value={stats.documentsIssued || 0} color="fuchsia" />
                <StatCard icon={<FaBuilding />} label="Organizations" value={stats.organizationsRegistered || 0} color="violet" />
              </>
            )}
            {profile?.role === 'admin' && (
              <>
                <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers || 0} color="emerald" />
                <StatCard icon={<FaFileAlt />} label="Total Documents" value={stats.totalDocuments || 0} color="teal" />
                <StatCard icon={<FaBuilding />} label="Organizations" value={stats.totalOrganizations || 0} color="indigo" />
                <StatCard icon={<FaClock />} label="Pending Approval" value={stats.pendingOrganizations || 0} color="amber" />
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column – Edit Profile & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-violet-500"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <FaUserCircle className="text-2xl text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Personal Information</h3>
                  <p className="text-slate-400 text-sm">Update your account details</p>
                </div>
              </div>
              {!editing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold text-sm hover:bg-indigo-500 hover:text-white transition-all"
                >
                  <FaPen /> <span>Edit</span>
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 disabled:opacity-50 transition-all"
                  >
                    <FaSave /> <span>{saving ? 'Saving...' : 'Save'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditing(false);
                      setEditForm({ name: profile.name, email: profile.email });
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 text-slate-400 border border-white/10 rounded-xl font-bold text-sm hover:text-white transition-all"
                  >
                    <FaTimes /> <span>Cancel</span>
                  </motion.button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <FaUserCircle />
                  </div>
                  <input 
                    type="text"
                    disabled={!editing}
                    className={`w-full pl-12 pr-4 py-4 bg-black/40 border rounded-xl transition-all text-white font-medium ${editing ? 'border-indigo-500/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'border-white/5 cursor-default'}`}
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <FaEnvelope />
                  </div>
                  <input 
                    type="email"
                    disabled={!editing}
                    className={`w-full pl-12 pr-4 py-4 bg-black/40 border rounded-xl transition-all text-white font-medium ${editing ? 'border-indigo-500/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'border-white/5 cursor-default'}`}
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaShieldAlt />
                    </div>
                    <input 
                      type="text"
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-slate-300 font-medium capitalize cursor-default"
                      value={profile?.role}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Account ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaKey />
                    </div>
                    <input 
                      type="text"
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-slate-500 font-mono text-sm cursor-default"
                      value={profile?._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-red-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <FaLock className="text-2xl text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Security</h3>
                  <p className="text-slate-400 text-sm">Manage your password</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-white transition-all"
              >
                <FaLock /> <span>{showPasswordSection ? 'Cancel' : 'Change Password'}</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {showPasswordSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                        <FaLock />
                      </div>
                      <input 
                        type={showCurrentPw ? 'text' : 'password'}
                        className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-slate-600 font-medium"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-amber-400 transition-colors">
                        {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                          <FaKey />
                        </div>
                        <input 
                          type={showNewPw ? 'text' : 'password'}
                          className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-slate-600 font-medium"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          placeholder="New password"
                        />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-amber-400 transition-colors">
                          {showNewPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                          <FaCheckCircle />
                        </div>
                        <input 
                          type={showConfirmPw ? 'text' : 'password'}
                          className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-slate-600 font-medium"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          placeholder="Confirm new password"
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-amber-400 transition-colors">
                          {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-black tracking-widest uppercase rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? 'Updating Password...' : 'Update Password'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!showPasswordSection && (
              <div className="flex items-center space-x-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <FaCheckCircle className="text-emerald-400" />
                <span className="text-slate-400 text-sm">Your password is securely hashed with bcrypt</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/20 text-fuchsia-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400'
  };

  return (
    <div className={`glass-card p-5 flex items-center space-x-4 bg-gradient-to-r ${colorMap[color]} border`}>
      <div className={`text-2xl ${colorMap[color].split(' ').pop()}`}>{icon}</div>
      <div className="flex-grow">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  );
};

export default Profile;
