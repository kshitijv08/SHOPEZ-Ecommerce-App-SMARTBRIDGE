import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import API from '../services/api';
import Loader from '../components/Loader';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <Loader />;

    return (
        <div className="order-confirm">
            <FiCheckCircle />
            <h1>Order Placed Successfully!</h1>
            {order && (
                <>
                    <p className="order-id">Order ID: {order._id}</p>
                    <p className="delivery-est">Estimated Delivery: {order.deliveryDate}</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
                        {order.mainImg && <img src={order.mainImg} alt="" style={{ width: 60, height: 60, objectFit: 'contain' }} />}
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{order.title}</p>
                            <p style={{ fontSize: 13, color: '#878787' }}>₹{Math.round(order.price - (order.price * order.discount / 100)).toLocaleString('en-IN')} × {order.quantity}</p>
                        </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#878787', marginBottom: 24 }}>Delivering to: {order.address}, {order.pincode}</p>
                </>
            )}
            <div className="order-confirm-btns">
                <Link to="/products" className="hero-btn">Continue Shopping</Link>
                <Link to="/profile" className="hero-btn" style={{ background: 'var(--primary)' }}>View My Orders</Link>
            </div>
        </div>
    );
};
export default OrderConfirmation;
