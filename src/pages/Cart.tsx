import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/ordersApi';

const FALLBACK_IMAGE = 'https://via.placeholder.com/80x80?text=No+Image';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const items = useAppSelector((state) => state.cart.items);
    const [checkedOut, setCheckedOut] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user) {
            setCheckoutError('You must be logged in to place an order.');
            return;
        }

        setCheckingOut(true);
        setCheckoutError(null);

        try {
            const orderItems = items.map(({ id, title, price, quantity, image }) => ({
                id,
                title,
                price,
                quantity,
                image,
            }));
            await createOrder(user.uid, orderItems, totalPrice);
            dispatch(clearCart());
            setCheckedOut(true);
        } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : 'Unable to place order.');
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <div className="page-shell cart-shell">
            <button onClick={() => navigate('/')}>Back to Shop</button>
            <h2>Shopping Cart</h2>

            {checkedOut && (
                <div className="alert alert-success">
                    Order placed! Check your <button className="link-button" onClick={() => navigate('/orders')}>order history</button>.
                </div>
            )}
            {checkoutError && <p className="auth-error">{checkoutError}</p>}

            {items.length === 0 && !checkedOut && <p>Your cart is empty.</p>}

            {items.length > 0 && (
                <>
                <ul className="list-unstyled">
                    {items.map((item) => (
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
                                <p className="mb-1">${item.price} each</p>
                                <div className="d-flex align-items-center gap-2">
                                    <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                                </div>
                            </div>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
                        </li>
                    ))}
                </ul>

                <h4>Total Items: {totalCount}</h4>
                <h4>Total Price: ${totalPrice.toFixed(2)}</h4>

                <button onClick={handleCheckout} disabled={checkingOut}>
                    {checkingOut ? 'Placing Order…' : 'Checkout'}
                </button>
              </>
            )}
        </div>
    );
};

export default Cart;