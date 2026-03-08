import { FiShield, FiTruck, FiRefreshCw, FiTwitter, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-top-inner">
                    <div className="footer-brand">
                        <div className="footer-logo">Shop<span>EZ</span></div>
                        <div className="footer-tagline">India's Smartest Shopping Destination</div>
                    </div>

                    <div className="footer-trust">
                        <div className="footer-trust-item"><FiShield /> Secure Payments</div>
                        <div className="footer-trust-item"><FiTruck /> Free Delivery above ₹499</div>
                        <div className="footer-trust-item"><FiRefreshCw /> 7-Day Returns</div>
                    </div>

                    <div className="footer-social">
                        <a href="#" className="footer-social-icon"><FiTwitter /></a>
                        <a href="#" className="footer-social-icon"><FiFacebook /></a>
                        <a href="#" className="footer-social-icon"><FiInstagram /></a>
                        <a href="#" className="footer-social-icon"><FiYoutube /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} ShopEZ — Built with React & Node.js
            </div>
        </footer>
    );
};
export default Footer;
