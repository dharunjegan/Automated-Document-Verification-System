import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLink, FaRegCheckCircle, FaChevronRight } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center text-center px-4 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 font-bold text-sm mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Secured by Hardhat Smart Contracts</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            Trust <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 text-glow">Verified</span>,<br />
            Anywhere, Anytime.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            The next generation automated document verification system. We bridge universities, issuers, and students through <strong className="text-indigo-300 font-semibold">immutable cryptographic hashes</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/verify">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 lg:py-5 bg-gradient-to-r from-primary to-accent text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-500/25 border border-white/10 flex items-center justify-center space-x-3 group"
              >
                <span>Verify a Document</span>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 lg:py-5 glass-panel text-white text-lg font-bold rounded-2xl shadow-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-3"
              >
                <span>Become an Issuer</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#05080f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              icon={<FaShieldAlt className="text-5xl text-indigo-400" />}
              title="Tamper-Proof"
              description="Documents are hashed via SHA-256 and anchored to an immutable smart contract, ensuring absolute integrity."
              delay={0.2}
            />
            <FeatureCard 
              icon={<FaLink className="text-5xl text-accent" />}
              title="Decentralized Validation"
              description="Validations run on strict blockchain-based cryptographic math, eliminating single points of failure."
              delay={0.4}
            />
            <FeatureCard 
              icon={<FaRegCheckCircle className="text-5xl text-emerald-400" />}
              title="Instant Verification"
              description="Anyone can verify an issued document in seconds globally, without relying on manual phone calls or emails."
              delay={0.6}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, type: "spring" }}
    viewport={{ once: true, margin: "-100px" }}
    className="glass-card p-10 flex flex-col items-start group"
  >
    <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-light text-lg">{description}</p>
  </motion.div>
);

export default Landing;
