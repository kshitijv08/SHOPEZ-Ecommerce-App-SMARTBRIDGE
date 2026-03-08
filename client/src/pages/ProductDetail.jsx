import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
                setMainImage(data.mainImg);
                if (data.sizes?.length) setSelectedSize(data.sizes[0]);
            } catch {
                addToast('Product not found', 'error');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <Loader />;
    if (!product) return null;

    const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
    const allImages = [product.mainImg, ...(product.carousel || [])];
    const descPoints = product.description.split('. ').filter(Boolean);

    const renderStars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '★' : '') + '☆'.repeat(5 - Math.ceil(r));

    const handleAddToCart = async () => {
        if (!user) { addToast('Please login first', 'error'); navigate('/login'); return; }
        try {
            await addToCart({ title: product.title, description: product.description, mainImg: product.mainImg, size: selectedSize, quantity, price: product.price, discount: product.discount });
            addToast('Added to cart!', 'success');
        } catch { addToast('Failed to add', 'error'); }
    };

    const handleBuyNow = async () => {
        if (!user) { addToast('Please login first', 'error'); navigate('/login'); return; }
        try {
            await addToCart({ title: product.title, description: product.description, mainImg: product.mainImg, size: selectedSize, quantity, price: product.price, discount: product.discount });
            navigate('/checkout');
        } catch { addToast('Failed', 'error'); }
    };

    return (
        <div className="product-detail">
            <div className="pd-images">
                <div className="pd-main-img"><img src={mainImage} alt={product.title} /></div>
                <div className="pd-thumbnails">
                    {allImages.map((img, i) => (
                        <div key={i} className={`pd-thumb ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                            <img src={img} alt="" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="pd-info">
                <div className="pd-breadcrumb">
                    <Link to="/">Home</Link> &gt; <Link to={`/products?category=${product.category}`}>{product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Link> &gt; {product.title}
                </div>
                <h1 className="pd-title">{product.title}</h1>
                <div className="pd-rating-row">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span>{product.reviews?.toLocaleString()} ratings</span>
                </div>

                <div className="pd-price-section">
                    <span className="pd-price-big">₹{discountedPrice.toLocaleString('en-IN')}</span>
                    <span className="pd-price-original">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="pd-price-off">{product.discount}% off</span>
                </div>

                {product.sizes?.length > 0 && (
                    <div className="pd-sizes">
                        <h4>Select Size:</h4>
                        <div className="pd-size-pills">
                            {product.sizes.map((s) => (
                                <button key={s} className={`pd-size-pill ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pd-quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <div className="pd-action-btns">
                    <button className="pd-btn-cart" onClick={handleAddToCart}><FiShoppingCart /> ADD TO CART</button>
                    <button className="pd-btn-buy" onClick={handleBuyNow}><FiZap /> BUY NOW</button>
                </div>

                <div className="pd-description">
                    <h4>About this item</h4>
                    <ul>{descPoints.map((p, i) => <li key={i}>{p}.</li>)}</ul>
                </div>

                <div className="pd-delivery-info">
                    <div className="pd-delivery-item"><FiTruck /> Free delivery on orders above ₹499</div>
                    <div className="pd-delivery-item"><FiShield /> 1 year warranty</div>
                    <div className="pd-delivery-item"><FiRefreshCw /> 7 day replacement</div>
                </div>
            </div>
        </div>
    );
};
export default ProductDetail;
