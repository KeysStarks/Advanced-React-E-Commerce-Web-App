import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrdersForUser } from '../api/ordersApi';

const formatDate = (createdAt?: { seconds: number } | null) =>
  createdAt ? new Date(createdAt.seconds * 1000).toLocaleString() : 'Just now';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => fetchOrdersForUser(user!.uid),
    enabled: !!user,
  });

  return (
    <div className="page-shell" style={{ marginTop: '1rem' }}>
      <h2>Order History</h2>

      {isPending && <p>Loading orders…</p>}
      {isError && <p className="auth-error">Unable to load orders: {error?.message}</p>}
      {!isPending && orders.length === 0 && <p className="muted-text">No orders yet.</p>}

      {orders.map((order) => (
        <div className="list-card" key={order.id}>
          <div className="list-card-header">
            <div>
              <strong>Order #{order.id.slice(0, 8)}</strong>
              <p className="muted-text">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p>${order.total.toFixed(2)}</p>
              <button onClick={() => navigate(`/orders/${order.id}`)}>View Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
