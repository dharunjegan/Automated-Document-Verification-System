import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30"
            >
              <FaShieldAlt className="text-xl" />
            </motion.div>
            <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
              DocVerify
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/verify" className="text-slate-300 hover:text-white transition font-medium text-sm uppercase tracking-wider">Verify</Link>
            
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition font-medium text-sm uppercase tracking-wider">Log in</Link>
                <Link to="/register">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-lg border border-white/10"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link to={`/${user.role}`} className="text-indigo-400 hover:text-indigo-300 font-bold capitalize tracking-wide text-sm">
                  {user.role} Portal
                </Link>
                <Link to="/profile" className="group flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md group-hover:shadow-indigo-500/40 transition-shadow">
                    {getInitials(user.name)}
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition font-medium text-sm tracking-wide"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
