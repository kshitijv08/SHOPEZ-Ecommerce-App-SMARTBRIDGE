import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categoryImages = {
    mobiles: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300',
    electronics: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
    fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    'sports-equipment': 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=300',
    groceries: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
};

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const deals = products.filter((p) => p.discount >= 15).slice(0, 8);
    const topPicks = products.slice(0, 8);
    const topDeals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 3);

    if (loading) return <Loader />;

    return (
        <div>
            {/* Hero Banner — Split Layout */}
            <div className="hero-banner">
                <div className="hero-banner-left">
                    <h1>
                        Shop Smarter,<br />
                        <span className="accent">Live Better.</span>
                    </h1>
                    <p>Discover deals across 5 categories — from mobiles to groceries.</p>
                    <div className="hero-banner-btns">
                        <Link to="/products" className="hero-btn hero-btn-primary">Explore Deals</Link>
                        <Link to="/products?sort=popular" className="hero-btn hero-btn-outline">New Arrivals</Link>
                    </div>
                </div>
                <div className="hero-banner-right">
                    <div className="hero-deals-header">
                        <span className="hero-deals-title"><FiTrendingUp /> Hot Deals</span>
                        <Link to="/products?sort=discount" className="hero-deals-link">See all →</Link>
                    </div>
                    <div className="hero-deals-list">
                        {topDeals.map((p) => (
                            <div key={p._id} className="hero-deal-card" onClick={() => navigate(`/products/${p._id}`)}>
                                <div className="hero-deal-img">
                                    <img src={p.mainImg} alt={p.title} />
                                </div>
                                <div className="hero-deal-info">
                                    <div className="hero-deal-name">{p.title}</div>
                                    <div className="hero-deal-cat">{p.category.replace(/-/g, ' ')}</div>
                                </div>
                                <div className="hero-deal-badge">{p.discount}% off</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Browse Categories — Circular */}
                <div className="section-header"><h2>Browse Categories</h2></div>
                <div className="category-cards">
                    {Object.entries(categoryImages).map(([key, img]) => (
                        <Link to={`/products?category=${key}`} key={key} className="category-card">
                            <img src={img} alt={key} />
                            <h3>{key.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
                        </Link>
                    ))}
                </div>

                {/* Deals of the Day */}
                <div className="section-header">
                    <h2>Deals of the Day <span className="section-tag">LIMITED TIME</span></h2>
                    <Link to="/products?sort=discount" className="view-all">View All →</Link>
                </div>
                <div className="scroll-row">
                    {deals.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Top Picks */}
                <div className="section-header">
                    <h2>Top Picks for You</h2>
                    <Link to="/products" className="view-all">View All →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingBottom: 24 }}>
                    {topPicks.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
            </div>
        </div>
    );
};
export default Home;
