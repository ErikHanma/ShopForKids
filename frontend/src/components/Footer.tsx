import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>GiftStore</h3>
                        <p>Best place to find gifts for kids!</p>
                    </div>
                    <div className="footer-section">
                        <h4>Links</h4>
                        <ul>
                            <li><a href="/products">Products</a></li>
                            <li><a href="/cart">Cart</a></li>
                            <li><a href="/profile">Profile</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>Email: support@giftstore.com</p>
                        <p>Phone: +1 234 567 890</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} GiftStore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;