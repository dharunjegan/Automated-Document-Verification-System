import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#05080f]/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
                <FaShieldAlt className="text-sm" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">DocVerify</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Enterprise-grade automated document verification powered by blockchain technology and cryptographic hashing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-500 hover:text-indigo-400 transition text-sm font-medium">Home</Link></li>
              <li><Link to="/verify" className="text-slate-500 hover:text-indigo-400 transition text-sm font-medium">Verify Document</Link></li>
              <li><Link to="/register" className="text-slate-500 hover:text-indigo-400 transition text-sm font-medium">Create Account</Link></li>
              <li><Link to="/login" className="text-slate-500 hover:text-indigo-400 transition text-sm font-medium">Login</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Technology</h4>
            <ul className="space-y-2">
              <li className="text-slate-500 text-sm">SHA-256 Document Hashing</li>
              <li className="text-slate-500 text-sm">Ethereum Smart Contracts</li>
              <li className="text-slate-500 text-sm">Hardhat Development</li>
              <li className="text-slate-500 text-sm">MERN Stack</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex justify-center items-center">
          <p className="text-slate-600 text-xs font-medium text-center">
            © {new Date().getFullYear()} DocVerify. All rights reserved to jdr.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
