import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import MemberManagement from './pages/MemberManagement';
import IssueReturn from './pages/IssueReturn';
import Search from './pages/Search';
import Reports from './pages/Reports';
import MemberPortal from './pages/MemberPortal';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/member-portal" element={<MemberPortal />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookManagement />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="issue-return" element={<IssueReturn />} />
          <Route path="search" element={<Search />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


