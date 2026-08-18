import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-links">
        <Link to="/">Home</Link>
        <Link to="/manage-products">Manage Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div className="app-navbar-user">
        <span>Signed in as: {user.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;