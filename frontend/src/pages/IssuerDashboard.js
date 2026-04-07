import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaServer, FaFingerprint, FaFileContract, FaBuilding, FaIdBadge, FaMapMarkerAlt, FaUpload, FaEnvelope } from 'react-icons/fa';

const IssuerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orgForm, setOrgForm] = useState({ name: '', registrationId: '', address: '' });
  const [docForm, setDocForm] = useState({ title: '', recipientEmail: '', organizationId: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('issue'); // 'issue' or 'registerOrg'

  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.post('http://localhost:5000/api/issuer/register-org', orgForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Organization submitted for admin approval!', { theme: "dark" });
      setOrgForm({ name: '', registrationId: '', address: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register org', { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Please attach a secure payload', { theme: "dark" });
    }
    
    const formData = new FormData();
    formData.append('title', docForm.title);
    formData.append('recipientEmail', docForm.recipientEmail);
    formData.append('organizationId', docForm.organizationId);
    formData.append('document', file);

    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.post('http://localhost:5000/api/issuer/issue', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Document minted securely on the blockchain!', { theme: "dark" });
      setDocForm({ title: '', recipientEmail: '', organizationId: '' });
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mint document', { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'issuer') return <div className="p-10 text-center text-white">Unauthorized Access</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      
      {/* Decorative Blur */}
      <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8 relative z-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-white tracking-tight mb-3"
          >
            Issuer <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400 text-glow">Terminal</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            Mint and anchor verified credentials into the blockchain
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 md:mt-0 flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-lg"
        >
          <button 
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm tracking-wide ${mode === 'issue' ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('issue')}
          >
            Mint Credential
          </button>
          <button 
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm tracking-wide ${mode === 'registerOrg' ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('registerOrg')}
          >
            Register Entity
          </button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'registerOrg' && (
          <motion.div 
            key="org"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 md:p-12 shadow-[0_0_40px_rgba(217,70,239,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-fuchsia-500 to-indigo-500"></div>
            
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
                <FaBuilding className="text-3xl text-fuchsia-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Entity Registration</h2>
                <p className="text-slate-400 font-medium">Register an organization for Admin approval</p>
              </div>
            </div>

            <form onSubmit={handleOrgSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Entity Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaBuilding />
                    </div>
                    <input type="text" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-white placeholder-slate-600 font-medium" value={orgForm.name} onChange={e => setOrgForm({...orgForm, name: e.target.value})} placeholder="Harvard University" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Government/Reg ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaIdBadge />
                    </div>
                    <input type="text" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-white placeholder-slate-600 font-mono" value={orgForm.registrationId} onChange={e => setOrgForm({...orgForm, registrationId: e.target.value})} placeholder="EDU-US-998877" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">HQ Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <FaMapMarkerAlt />
                  </div>
                  <input type="text" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-white placeholder-slate-600 font-medium" value={orgForm.address} onChange={e => setOrgForm({...orgForm, address: e.target.value})} placeholder="123 Academic Way, Cambridge" />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(217,70,239,0.4)" }}
                whileTap={{ scale: 0.99 }}
                disabled={loading} 
                className="w-full py-5 mt-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black tracking-widest uppercase rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Transmitting Request...' : 'Submit to Network Consensus'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {mode === 'issue' && (
          <motion.div 
            key="mint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 md:p-12 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-fuchsia-500"></div>
            
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <FaFileContract className="text-3xl text-indigo-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Mint Credential</h2>
                <p className="text-slate-400 font-medium">Anchor a new document hash to the ledger</p>
              </div>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Document Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <FaFileContract />
                  </div>
                  <input type="text" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 font-medium" value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} placeholder="e.g. Bachelor of Science Degree" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Target Recipient Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaEnvelope />
                    </div>
                    <input type="email" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 font-medium" value={docForm.recipientEmail} onChange={e => setDocForm({...docForm, recipientEmail: e.target.value})} placeholder="student@domain.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Your Entity Identifier</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <FaServer />
                    </div>
                    <input type="text" required className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 font-mono" value={docForm.organizationId} onChange={e => setDocForm({...docForm, organizationId: e.target.value})} placeholder="64bced2..." />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Secure Payload (PDF/IMG)</label>
                <div className="relative w-full border-2 border-dashed border-white/20 rounded-2xl bg-black/20 hover:bg-black/40 hover:border-indigo-500/50 transition-all p-8 flex flex-col items-center justify-center cursor-pointer group">
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FaUpload className="text-2xl text-indigo-400" />
                  </div>
                  <p className="text-white font-medium mb-1">{file ? file.name : "Select or drag & drop payload"}</p>
                  <p className="text-slate-500 text-sm">Upload cryptographic source file</p>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.99 }}
                disabled={loading} 
                className="w-full py-5 mt-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-black tracking-widest uppercase rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <FaFingerprint className="text-xl" />
                    <span>Mint & Issue Document</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssuerDashboard;
