import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [wishlisted, setWishlisted] = useState(false);

    const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            addToast('Please login to add items to cart', 'error');
            navigate('/login');
            return;
        }
        try {
            await addToCart({
                title: product.title,
                description: product.description,
                mainImg: product.mainImg,
                size: product.sizes?.[0] || '',
                quantity: 1,
                price: product.price,
                discount: product.discount,
            });
            addToast(`${product.title} added to cart`, 'success');
        } catch {
            addToast('Failed to add to cart', 'error');
        }
    };

    const handleBuyNow = (e) => {
        e.stopPropagation();
        if (!user) {
            addToast('Please login first', 'error');
            navigate('/login');
            return;
        }
        handleAddToCart(e).then(() => navigate('/checkout'));
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        setWishlisted(!wishlisted);
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let stars = '★'.repeat(full);
        if (half) stars += '★';
        stars += '☆'.repeat(5 - full - (half ? 1 : 0));
        return stars;
    };

    return (
        <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
            <div className="product-card-img">
                {product.discount > 0 && (
                    <span className="discount-badge">{product.discount}% off</span>
                )}
                <button className={`wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={toggleWishlist}>
                    <FiHeart fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
                <img src={product.mainImg} alt={product.title} />
            </div>
            <div className="product-card-body">
                <div className="product-card-title">{product.title}</div>
                <div className="product-card-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span>({product.reviews?.toLocaleString()})</span>
                </div>
                <div className="product-card-price">
                    <span className="current">₹{discountedPrice.toLocaleString('en-IN')}</span>
                    <span className="original">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="off">{product.discount}% off</span>
                </div>
                <div className="product-card-actions">
                    <button className="btn-add-cart" onClick={handleAddToCart}>
                        <FiShoppingCart /> Add to Cart
                    </button>
                    <button className="btn-shop-now" onClick={handleBuyNow}>
                        <FiZap /> Buy
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
