import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data);
      toast.success('Access Granted', { theme: "dark" });
      navigate(`/${res.data.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed', { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md glass-card p-10 relative z-10 box-glow"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Welcome Back</h2>
          <p className="text-slate-400">Authenticate to access DocVerify</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-[#0B0F19]/50 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Secure Email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Master Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaLock />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                className="w-full pl-12 pr-12 py-4 bg-[#0B0F19]/50 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400 transition-colors">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-accent text-white font-bold tracking-wide rounded-xl shadow-lg border border-white/10 transition disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Authenticate Access'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Unregistered node? <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Initialize account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
