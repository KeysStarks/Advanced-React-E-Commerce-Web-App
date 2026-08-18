import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOrderById } from '../api/ordersApi';

const FALLBACK_IMAGE = 'https://via.placeholder.com/80x80?text=No+Image';

const formatDate = (createdAt?: { seconds: number } | null) =>
  createdAt ? new Date(createdAt.seconds * 1000).toLocaleString() : 'Unknown date';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });

  return (
    <div className="page-shell" style={{ marginTop: '1rem' }}>
      <button onClick={() => navigate('/orders')}>Back to Order History</button>

      {isPending && <p>Loading order…</p>}
      {isError && <p className="auth-error">Unable to load order: {error?.message}</p>}
      {!isPending && !order && <p className="muted-text">Order not found.</p>}

      {order && (
        <>
          <h2>Order #{order.id.slice(0, 8)}</h2>
          <p className="muted-text">{formatDate(order.createdAt)}</p>

          <ul className="list-unstyled">
            {order.items.map((item) => (
              <li key={item.id} className="d-flex align-items-center mb-3 border-bottom pb-2">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 60, height: 60, objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p className="mb-1">{item.title}</p>
                  <p className="mb-1">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          <h4>Total: ${order.total.toFixed(2)}</h4>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
