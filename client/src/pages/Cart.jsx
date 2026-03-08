import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import Loader from '../components/Loader';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, loading, removeFromCart, updateQuantity } = useCart();

    if (loading) return <Loader />;

    if (cartItems.length === 0) {
        return (
            <div className="container">
                <div className="cart-empty" style={{ marginTop: 40 }}>
                    <FiShoppingCart />
                    <h2>Your cart is empty</h2>
                    <p>Add items to it now</p>
                    <Link to="/products" className="hero-btn">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-items">
                <h2 style={{ marginBottom: 16 }}>My Cart ({cartItems.length})</h2>
                {cartItems.map((item) => {
                    const dp = Math.round(item.price - (item.price * item.discount) / 100);
                    return (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-img">
                                <img src={item.mainImg} alt={item.title} />
                            </div>
                            <div className="cart-item-info">
                                <div className="cart-item-title">{item.title}</div>
                                {item.size && <div className="cart-item-size">Size: {item.size}</div>}
                                <div className="cart-item-qty">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="cart-item-price">
                                    <span className="current">₹{(dp * item.quantity).toLocaleString('en-IN')}</span>
                                    <span className="original">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="cart-item-seller">Sold by ShopEZ</div>
                                <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="cart-summary">
                <CartDrawer cartItems={cartItems} />
                <button className="btn-place-order" onClick={() => navigate('/checkout')}>
                    PLACE ORDER
                </button>
            </div>
        </div>
    );
};
export default Cart;
