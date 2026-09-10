import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MemberDetails from './pages/MemberDetails';
import MemberPayments from './pages/MemberPayments';
import UpcomingPayments from './pages/UpcomingPayments';
import RecentPayments from './pages/RecentPayments';
import Members from './pages/Members';
import Plans from './pages/Plans';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import More from './pages/More';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/upcoming-payments" element={<UpcomingPayments />} />
          <Route path="/recent-payments" element={<RecentPayments />} />
          <Route path="/member/:id" element={<MemberDetails />} />
          <Route path="/member/:id/payments" element={<MemberPayments />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
