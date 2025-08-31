import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { useAuthStore } from './store/auth';
import { Login } from './pages/Auth/Login';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Import } from './pages/Import/Import';
import { Inventory } from './pages/Inventory/Inventory';
import { Streams } from './pages/Streams/Streams';
import { StreamDetail } from './pages/Streams/StreamDetail';
import { Builder } from './pages/Builder/Builder';
import { Shipping } from './pages/Shipping/Shipping';
import { Reports } from './pages/Reports/Reports';
import { Users } from './pages/Users/Users';
import { Audit } from './pages/Audit/Audit';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Check authentication on app startup
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check authentication on app startup
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <>
          <Login />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569'
              }
            }}
          />
        </>
      </ErrorBoundary>
        </>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="import" element={<Import />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="streams" element={<Streams />} />
            <Route path="streams/:id" element={<StreamDetail />} />
            <Route path="builder" element={<Builder />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="audit" element={<Audit />} />
          </Route>
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #475569'
            }
          }}
        />
      </Router>
    </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}

export default App;