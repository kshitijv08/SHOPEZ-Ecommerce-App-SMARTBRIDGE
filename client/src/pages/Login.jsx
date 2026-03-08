import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            addToast(`Welcome back, ${user.username}!`, 'success');
            navigate(user.usertype === 'admin' ? '/admin' : '/');
        } catch (err) {
            addToast(err.response?.data?.message || 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-image">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="ShopEZ" />
                <div className="auth-image-overlay">
                    <h2>Welcome Back to ShopEZ</h2>
                    <p>India's smartest shopping destination — millions of products, unbeatable prices.</p>
                </div>
            </div>
            <div className="auth-form-wrap">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <p className="subtitle">Sign in to your ShopEZ account</p>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" required value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="Enter your password" />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>

                    <div className="form-footer">
                        New to ShopEZ? <Link to="/register">Create an account</Link>
                    </div>

                    <div className="demo-box">
                        <FiInfo />
                        <div>
                            <strong>Demo Credentials:</strong><br />
                            Admin: admin@shopez.com / Admin@123<br />
                            User: user@shopez.com / User@123
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
