import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { BiMobile } from 'react-icons/bi';
import { MdComputer, MdSportsSoccer, MdCheckroom, MdLocalGroceryStore } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
    { name: 'Mobiles', icon: <BiMobile />, value: 'mobiles' },
    { name: 'Electronics', icon: <MdComputer />, value: 'electronics' },
    { name: 'Fashion', icon: <MdCheckroom />, value: 'fashion' },
    { name: 'Sports', icon: <MdSportsSoccer />, value: 'sports-equipment' },
    { name: 'Groceries', icon: <MdLocalGroceryStore />, value: 'groceries' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">Shop<span>EZ</span></Link>

                    <form className="navbar-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search Electronics, Fashion, Mobiles, etc."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit"><FiSearch /></button>
                    </form>

                    <div className="navbar-actions">
                        {user ? (
                            <div className="nav-user-menu" ref={dropRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)}>
                                    <FiUser /> {user.username} <FiChevronDown />
                                </button>
                                {showDropdown && (
                                    <div className="nav-user-dropdown">
                                        <Link to="/profile" onClick={() => setShowDropdown(false)}>
                                            <FiUser style={{ marginRight: 6 }} /> My Profile
                                        </Link>
                                        {user.usertype === 'admin' && (
                                            <Link to="/admin" onClick={() => setShowDropdown(false)}>
                                                <FiGrid style={{ marginRight: 6 }} /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}>
                                            <FiLogOut style={{ marginRight: 6 }} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="nav-login-btn">Login</Link>
                        )}

                        <Link to="/cart" className="nav-cart-badge">
                            <FiShoppingCart size={20} />
                            {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        </Link>

                        <Link to="/" className="seller-link">Become a Seller</Link>
                    </div>
                </div>
            </nav>

            <div className="category-strip">
                <div className="category-strip-inner">
                    {categories.map((cat) => (
                        <Link
                            key={cat.value}
                            to={`/products?category=${cat.value}`}
                            className="cat-strip-item"
                        >
                            {cat.icon}
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};
export default Navbar;
