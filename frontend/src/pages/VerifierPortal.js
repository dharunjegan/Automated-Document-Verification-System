import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaLink, FaFingerprint } from 'react-icons/fa';

const VerifierPortal = () => {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!hash.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/public/verify/${hash}`);
      setResult(res.data.document);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Hash not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] relative pt-20 px-4 pb-20 overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGwtMi0ydi00bC0yLTJ2LTRsLTItMnYtNGwtMi0ydi00bC0yLTJ2LTRsLTItMnYtNGwtMi0yIiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
          >
            <FaFingerprint className="text-5xl text-indigo-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Verify a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-fuchsia-400 text-glow">Document</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Enter the 64-character cryptographic SHA-256 hash to validate its authenticity instantly on the blockchain.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleVerify} 
          className="relative max-w-3xl mx-auto mb-16 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
            <div className="pl-6 pr-4 text-slate-500">
              <FaSearch className="text-2xl" />
            </div>
            <input 
              type="text" 
              className="w-full bg-transparent py-5 lg:py-6 outline-none text-white text-lg lg:text-xl font-mono placeholder-slate-500 tracking-wider"
              placeholder="e.g. 0xabcdef123456..."
              value={hash}
              onChange={(e) => setHash(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 lg:py-5 px-8 lg:px-12 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 text-lg ml-2"
            >
              {loading ? 'Scanning...' : 'Verify'}
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="glass-card border-red-500/30 p-12 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="text-red-500 text-5xl" />
              </div>
              <h3 className="text-3xl font-bold text-red-400 mb-3">Verification Failed</h3>
              <p className="text-slate-300 text-lg">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="glass-card border-emerald-500/30 p-10 max-w-3xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden relative"
            >
              {/* Success Background Glow */}
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10 border-b border-white/10 pb-10 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  <FaCheckCircle className="text-white text-5xl" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-2">{result.title}</h3>
                  <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-bold tracking-wide text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>100% AUTHENTIC DOCUMENT</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <DetailRow label="Issuing Organization" value={result.organization} highlight />
                <DetailRow label="Issuer Contact" value={result.issuerName} />
                <DetailRow label="Status" value={result.status.toUpperCase()} />
                <DetailRow label="Date Anchored" value={new Date(result.issuedAt).toUTCString()} />
                
                <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
                    <FaFingerprint /> <span>Cryptographic Hash</span>
                  </p>
                  <p className="font-mono text-sm md:text-base text-slate-300 break-all">{result.hash}</p>
                </div>
                
                {result.blockchainTx && (
                  <div className="mt-4 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start space-x-4">
                    <div className="mt-1 bg-indigo-500/20 p-2 rounded-lg">
                      <FaLink className="text-indigo-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Blockchain Tx Receipt</p>
                      <p className="font-mono text-sm text-indigo-200 break-all">{result.blockchainTx}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/5 last:border-0 rounded-xl px-4 hover:bg-white/5 transition-colors">
    <span className="text-slate-400 font-medium text-lg mb-1 sm:mb-0">{label}</span>
    <span className={`font-bold text-right sm:text-lg ${highlight ? 'text-white text-xl' : 'text-slate-200'}`}>
      {value}
    </span>
  </div>
);

export default VerifierPortal;
