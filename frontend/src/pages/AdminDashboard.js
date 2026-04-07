import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaCheck, FaTimes, FaQrcode } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const res = await axios.get('http://localhost:5000/api/admin/organizations/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrganizations(res.data);
    } catch (err) {
      toast.error('Failed to load network organizations', { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.put(`http://localhost:5000/api/admin/organizations/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Organization ${action}d successfully`, { theme: "dark" });
      fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} organization`, { theme: "dark" });
    }
  };

  if (!user || user.role !== 'admin') return <div className="p-10 text-center text-white">Unauthorized Access</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div className="mb-12 border-b border-white/10 pb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-black text-white tracking-tight mb-3"
        >
          Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-glow">Command Console</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl"
        >
          Review and authorize institutional nodes joining the verification network.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center flex-col items-center py-32 space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-emerald-500 font-mono tracking-widest text-sm animate-pulse">SYNCING NETWORK DATA...</p>
        </div>
      ) : organizations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-16 text-center shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
          <FaBuilding className="mx-auto text-6xl text-slate-600 mb-6 relative z-10" />
          <h3 className="text-3xl font-bold text-white mb-4 relative z-10 tracking-wide">Network is Stable</h3>
          <p className="text-slate-400 max-w-md mx-auto relative z-10 text-lg">
            No pending organizations require administrative approval at this time.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {organizations.map((org, index) => (
              <motion.div 
                key={org._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="glass-card group relative overflow-hidden flex flex-col h-full border border-emerald-500/20 hover:border-emerald-500/50"
              >
                {/* Header Gradient */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                
                <div className="p-8 pb-6 flex-grow relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                      <FaBuilding className="text-3xl text-emerald-400" />
                    </div>
                    <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      PENDING REVIEW
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-300 transition-colors">{org.name}</h3>
                  
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5 inline-flex items-center space-x-2 mb-6">
                    <FaQrcode className="text-emerald-500/70" />
                    <span className="font-mono text-sm text-emerald-200/80">{org.registrationId}</span>
                  </div>
                  
                  <div className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/5 backdrop-blur-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Physical Address</p>
                      <p className="text-sm text-slate-300 truncate">{org.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Operator Identity</p>
                      <p className="text-sm text-indigo-300 truncate">{org.adminUser?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex px-8 pb-8 space-x-4 relative z-10 mt-auto">
                  <button 
                    onClick={() => handleAction(org._id, 'approve')}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400 hover:bg-emerald-400 py-3 rounded-xl font-bold transition-all"
                  >
                    <FaCheck /> <span>Approve</span>
                  </button>
                  <button 
                    onClick={() => handleAction(org._id, 'reject')}
                    className="flex-1 flex items-center justify-center space-x-2 bg-transparent text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 py-3 rounded-xl font-bold transition-all"
                  >
                    <FaTimes /> <span>Reject</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
