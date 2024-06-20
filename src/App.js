import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import GlobalStyle from './GlobalStyles';
import PrivateRoute from './components/PrivateRoute'; // You'll create this next

function App() {
  return (
    <AuthProvider>
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
