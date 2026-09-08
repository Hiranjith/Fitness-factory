import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MemberDetails from './pages/MemberDetails';
import MemberPayments from './pages/MemberPayments';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/member/:id" element={<MemberDetails />} />
          <Route path="/member/:id/payments" element={<MemberPayments />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
