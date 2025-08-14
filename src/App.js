import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StoriesPage from './pages/StoriesPage';
import Editor from './pages/Editor';
import AuthPage from './pages/AuthPage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import GlobalStyles from './GlobalStyles';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/stories" element={<PrivateRoute><StoriesPage /></PrivateRoute>} />

            {/* The editor can be accessed for a new story or an existing one */}
            <Route path="/editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
            <Route path="/editor/:storyId" element={<PrivateRoute><Editor /></PrivateRoute>} />

            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
