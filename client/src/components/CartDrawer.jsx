// CartDrawer — not used as a drawer in our layout; kept as a shared price-summary component
const CartDrawer = ({ cartItems }) => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const totalDiscount = cartItems.reduce(
        (s, i) => s + (i.price * i.discount / 100) * (i.quantity || 1), 0
    );
    const finalTotal = subtotal - totalDiscount;
    const totalItems = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);

    return (
        <div className="cart-summary-card">
            <h3>PRICE DETAILS</h3>
            <div className="cart-summary-row">
                <span>Price ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row green">
                <span>Discount</span>
                <span>−₹{Math.round(totalDiscount).toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row green">
                <span>Delivery Charges</span>
                <span>FREE</span>
            </div>
            <hr className="cart-summary-divider" />
            <div className="cart-summary-total">
                <span>TOTAL AMOUNT</span>
                <span>₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-savings">
                You save ₹{Math.round(totalDiscount).toLocaleString('en-IN')} on this order
            </div>
        </div>
    );
};
export default CartDrawer;
