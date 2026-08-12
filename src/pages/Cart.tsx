import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../redux/cartSlice';

const FALLBACK_IMAGE = 'https://via.placeholder.com/80x80?text=No+Image';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);
    const [checkedOut, setCheckedOut] = useState(false);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        dispatch(clearCart());
        setCheckedOut(true);
    };

    return (
        <div className="container p-3">
            <button onClick={() => navigate('/')}>Back to Shop</button>
            <h2>Shopping Cart</h2>

            {checkedOut && <div className="alert alert-success">Order placed! Your cart has been cleared.</div>}

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

                <button onClick={handleCheckout}>Checkout</button>
              </>
            )}
        </div>
    );
};

export default Cart;