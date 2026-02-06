import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-300 font-sans">
          <div className="flex-1 overflow-y-auto pb-24">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <div className="shrink-0 z-50">
            <Navbar />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
