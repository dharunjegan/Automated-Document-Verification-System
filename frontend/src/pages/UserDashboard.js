import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaDownload, FaShareAlt, FaCheckCircle, FaLock, FaCertificate, FaRegClock } from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const res = await axios.get('http://localhost:5000/api/user/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(res.data);
      } catch (err) {
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    toast.success('Document Hash copied to clipboard!', { theme: "dark" });
  };

  if (!user || user.role !== 'user') return <div className="p-10 text-center text-white">Unauthorized</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="mb-12 border-b border-white/10 pb-8 relative">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-black text-white tracking-tight mb-3"
        >
          My Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 text-glow">Vault</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl"
        >
          Access, verify, and share your cryptographically secured credentials.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-16 text-center box-glow relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
          <FaLock className="mx-auto text-6xl text-slate-600 mb-6 relative z-10" />
          <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Your Vault is Empty</h3>
          <p className="text-slate-400 max-w-md mx-auto relative z-10 text-lg">
            When organizations issue documents to your email, they will automatically appear here secured by the blockchain.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, index) => (
            <motion.div 
              key={doc._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
              className="glass-card group relative overflow-hidden flex flex-col h-full"
            >
              {/* Card Header Background Gradient */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 group-hover:from-indigo-500/30 group-hover:to-violet-500/30 transition-all duration-500"></div>
              
              <div className="p-6 relative z-10 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner">
                    <FaCertificate className="text-2xl text-indigo-400" />
                  </div>
                  <span className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                    <FaCheckCircle /> <span>VERIFIED</span>
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{doc.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex items-center">
                  <span className="mr-2">Issued by</span> 
                  <span className="font-semibold text-indigo-300">{doc.organization?.name}</span>
                </p>
                
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-6 backdrop-blur-md">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5 flex justify-between">
                    <span>Smart Contract Hash</span>
                    <FaLock />
                  </p>
                  <p className="text-xs font-mono text-indigo-200/80 break-all leading-relaxed">{doc.documentHash}</p>
                </div>
              </div>

              <div className="p-6 pt-0 relative z-10 mt-auto">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => copyToClipboard(doc.documentHash)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-3 rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300"
                  >
                    <FaShareAlt /> <span>Share Hash</span>
                  </button>
                  <a 
                    href={`http://localhost:5000/${doc.fileUrl.replace('\\', '/')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-[0.4] flex items-center justify-center space-x-2 bg-white/5 text-white border border-white/10 py-3 rounded-xl hover:bg-white hover:text-black transition-all duration-300"
                    title="Download Original File"
                  >
                    <FaDownload />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
