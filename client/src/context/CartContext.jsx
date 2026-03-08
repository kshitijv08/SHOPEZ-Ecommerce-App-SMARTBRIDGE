import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            setLoading(true);
            const { data } = await API.get('/cart');
            setCartItems(data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (item) => {
        try {
            await API.post('/cart', item);
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const removeFromCart = async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const updateQuantity = async (id, quantity) => {
        try {
            if (quantity < 1) return;
            await API.put(`/cart/${id}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const clearCart = async () => {
        try {
            await API.delete('/cart/clear');
            setCartItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
    );

    const totalDiscount = cartItems.reduce(
        (sum, item) => sum + (item.price * item.discount / 100) * (item.quantity || 1),
        0
    );

    const finalTotal = subtotal - totalDiscount;

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                cartCount,
                subtotal,
                totalDiscount,
                finalTotal,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
