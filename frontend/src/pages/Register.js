import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FaUserAstronaut, FaEnvelope, FaLock, FaUserSecret, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data);
      toast.success('Network Node Initialized', { theme: "dark" });
      navigate(`/${res.data.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full mix-blend-screen filter blur-[150px] animate-blob pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-lg glass-card p-10 relative z-10 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-3">Join the Network</h2>
          <p className="text-slate-400 text-lg">Initialize your cryptographic identity</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Entity Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaUserAstronaut />
              </div>
              <input 
                type="text" required
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Digital Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaEnvelope />
              </div>
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@domain.com"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Secure Passkey</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaLock />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} required
                className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400 transition-colors">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Node Permissions</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaUserSecret />
              </div>
              <select 
                className="w-full pl-12 pr-4 py-3.5 bg-[#0e1420] border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user" className="bg-[#0e1420]">Recipient / Student</option>
                <option value="issuer" className="bg-[#0e1420]">Organization / Issuer</option>
                <option value="verifier" className="bg-[#0e1420]">Third-Party Verifier</option>
              </select>
            </div>
            {formData.role === 'issuer' && (
              <p className="text-xs text-amber-400/80 mt-2 font-medium bg-amber-500/10 p-2 rounded border border-amber-500/20">
                Network Rule: Issuers require Admin multisig approval before minting credentials.
              </p>
            )}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition disabled:opacity-70"
          >
            {loading ? 'Initializing Node...' : 'Establish Identity'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already established? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Authenticate Access</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
