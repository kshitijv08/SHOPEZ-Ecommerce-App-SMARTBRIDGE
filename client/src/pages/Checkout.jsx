import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiSmartphone, FiCreditCard } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import CartDrawer from '../components/CartDrawer';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, clearCart } = useCart();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.username || '', email: user?.email || '', mobile: '', address: '', pincode: '',
    });
    const [payment, setPayment] = useState('cod');
    const [upiId, setUpiId] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) { addToast('Cart is empty', 'error'); return; }
        setLoading(true);
        try {
            const { data } = await API.post('/orders', {
                items: cartItems,
                name: form.name, email: form.email, mobile: form.mobile,
                address: form.address, pincode: form.pincode, paymentMethod: payment,
            });
            await clearCart();
            addToast('Order placed successfully!', 'success');
            navigate(`/order-confirmation/${data[0]._id}`);
        } catch (err) {
            addToast(err.response?.data?.message || 'Order failed', 'error');
        } finally { setLoading(false); }
    };

    return (
        <div className="checkout-page">
            <form className="checkout-form" onSubmit={handleSubmit}>
                <h2>Delivery Address</h2>
                <div className="form-row">
                    <div className="form-group"><label>Full Name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
                    <div className="form-group"><label>Email</label><input name="email" type="email" required value={form.email} onChange={handleChange} /></div>
                    <div className="form-group"><label>Mobile</label><input name="mobile" required value={form.mobile} onChange={handleChange} placeholder="10-digit number" /></div>
                </div>
                <div className="form-group"><label>Full Address</label><textarea name="address" required value={form.address} onChange={handleChange} placeholder="House/Flat, Street, Area, City, State" /></div>
                <div className="form-row">
                    <div className="form-group"><label>Pincode</label><input name="pincode" required value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" /></div>
                    <div className="form-group"></div>
                </div>

                <div className="payment-methods">
                    <h2>Payment Method</h2>
                    {[
                        { key: 'cod', label: 'Cash on Delivery', icon: <FiTruck /> },
                        { key: 'upi', label: 'UPI Payment', icon: <FiSmartphone /> },
                        { key: 'card', label: 'Credit / Debit Card', icon: <FiCreditCard /> },
                    ].map((m) => (
                        <div key={m.key}>
                            <div className={`payment-option ${payment === m.key ? 'active' : ''}`} onClick={() => setPayment(m.key)}>
                                <input type="radio" checked={payment === m.key} onChange={() => setPayment(m.key)} />
                                {m.icon} <span>{m.label}</span>
                            </div>
                            {payment === 'upi' && m.key === 'upi' && (
                                <div className="payment-extra-fields"><input placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
                            )}
                            {payment === 'card' && m.key === 'card' && (
                                <div className="payment-extra-fields">
                                    <input placeholder="Card Number" /><input placeholder="Expiry (MM/YY)" /><input placeholder="CVV" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button className="btn-place-order" type="submit" disabled={loading} style={{ marginTop: 20 }}>
                    {loading ? 'Placing Order...' : 'PLACE ORDER'}
                </button>
            </form>

            <div className="cart-summary">
                <CartDrawer cartItems={cartItems} />
            </div>
        </div>
    );
};
export default Checkout;
