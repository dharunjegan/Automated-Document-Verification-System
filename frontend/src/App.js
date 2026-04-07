import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import IssuerDashboard from './pages/IssuerDashboard';
import UserDashboard from './pages/UserDashboard';
import VerifierPortal from './pages/VerifierPortal';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private Routes would normally be protected with a PrivateRoute wrapper component,
                  but we're handling role-based auth inside the components themselves for simplicity */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/issuer" element={<IssuerDashboard />} />
              <Route path="/user" element={<UserDashboard />} />
              
              <Route path="/verify" element={<VerifierPortal />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />
      </Router>
    </AuthProvider>
  );
}

export default App;
