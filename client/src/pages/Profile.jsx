import { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const statusClass = (s) => s.replace(/\s+/g, '-');

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/orders/my-orders').then(({ data }) => setOrders(data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                <div className="profile-info">
                    <h2>{user?.username}</h2>
                    <p>{user?.email}</p>
                    <p>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
                </div>
                <button className="profile-logout" onClick={handleLogout}>Logout</button>
            </div>

            <div className="orders-section">
                <h2>My Orders</h2>
                {loading ? <Loader /> : orders.length === 0 ? (
                    <div className="orders-empty">
                        <FiPackage /><h3>No orders yet</h3><p>Start shopping to see your orders here</p>
                    </div>
                ) : (
                    <div className="orders-table">
                        <table>
                            <thead><tr><th>Product</th><th>Name</th><th>Size</th><th>Qty</th><th>Price</th><th>Status</th><th>Date</th></tr></thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o._id}>
                                        <td><img src={o.mainImg} alt="" /></td>
                                        <td>{o.title}</td>
                                        <td>{o.size || '—'}</td>
                                        <td>{o.quantity}</td>
                                        <td>₹{Math.round(o.price - (o.price * o.discount / 100)).toLocaleString('en-IN')}</td>
                                        <td><span className={`status-badge ${statusClass(o.orderStatus)}`}>{o.orderStatus}</span></td>
                                        <td>{o.orderDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Profile;
