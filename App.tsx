import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Impacto from './pages/Impacto';
import Contratos from './pages/Contratos';
import ComoFunciona from './pages/ComoFunciona';
import HojaDeRuta from './pages/HojaDeRuta';
import Oportunidades from './pages/Oportunidades';
import Signup from './pages/Signup';
import SignupSuccess from './pages/SignupSuccess';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import KYCUpload from './pages/KYCUpload';
import KYCSuccess from './pages/KYCSuccess';
import InvestorProfileQuiz from './pages/InvestorProfileQuiz';
import InvestorProfileSuccess from './pages/InvestorProfileSuccess';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Cartera from './pages/Cartera';
import UserImpact from './pages/UserImpact';
import Settings from './pages/Settings';
import Clasificacion from './pages/Clasificacion';
import Ayuda from './pages/Ayuda';
import ContractDetail from './pages/ContractDetail';

// Using HashRouter to ensure compatibility with static hosting environments
const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/impacto" element={<Impacto />} />
        <Route path="/contratos" element={<Contratos />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/hoja-de-ruta" element={<HojaDeRuta />} />
        <Route path="/oportunidades" element={<Navigate to="/mercado-primario" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/kyc-upload" element={<KYCUpload />} />
        <Route path="/kyc-success" element={<KYCSuccess />} />
        <Route path="/investor-profile" element={<InvestorProfileQuiz />} />
        <Route path="/investor-profile-success" element={<InvestorProfileSuccess />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mercado-primario" element={<Oportunidades />} />
          <Route path="/mercado-secundario" element={<Marketplace />} />
          <Route path="/cartera" element={<Cartera />} /> 
          <Route path="/mi-impacto" element={<UserImpact />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/ajustes" element={<Settings />} />
          <Route path="/clasificacion" element={<Clasificacion />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/contrato/:id" element={<ContractDetail />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;