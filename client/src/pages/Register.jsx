import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
    const { register } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            addToast('Passwords do not match', 'error');
            return;
        }
        setLoading(true);
        try {
            await register({ username: form.username, email: form.email, password: form.password });
            addToast('Account created successfully!', 'success');
            navigate('/');
        } catch (err) {
            addToast(err.response?.data?.message || 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-image">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="ShopEZ" />
                <div className="auth-image-overlay">
                    <h2>Join ShopEZ Today</h2>
                    <p>Create your account and start shopping with the best deals!</p>
                </div>
            </div>
            <div className="auth-form-wrap">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <p className="subtitle">Register for a new ShopEZ account</p>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" required value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            placeholder="Enter your full name" />
                    </div>
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
                            placeholder="Create a password" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" required value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="Confirm your password" />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Register'}
                    </button>

                    <div className="form-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Register;
