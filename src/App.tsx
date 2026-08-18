import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ManageProducts from './pages/ManageProducts';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="auth-loading">Loading auth state...</p>;

  if (!user) {
    return (
      <div className="auth-shell">
        <div className="auth-panel">
          <h2>Firebase Auth</h2>
          <p className="auth-subtitle">Sign in to access your store experience.</p>
          <div className="auth-forms">
            <Register />
            <Login />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
      <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;