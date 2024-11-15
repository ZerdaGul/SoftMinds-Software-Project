import React from 'react';
import './HomePage.scss';

function HomePage() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Innovative Solutions to Empower Businesses</h1>
                    <button className="learn-more">Learn more</button>
                </div>
            </section>

            {/* New Products Section */}
            <section className="new-products">
                <h2>New Products</h2>
                <div className="products">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="product-card">
                            <img src="https://via.placeholder.com/150" alt="Product" />
                            <div className="product-details">
                                <h3>Product Name</h3>
                                <p>$25.55</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sectors Section */}
            <section className="sectors">
                <h2>Sectors</h2>
                <div className="sector-cards">
                    <div className="sector-card smart-city">
                        <p>Smart City</p>
                    </div>
                    <div className="sector-card energy">
                        <p>Energy</p>
                    </div>
                    <div className="sector-card its-traffic">
                        <p>ITS & Traffic</p>
                    </div>
                    <div className="sector-card security-surveillance">
                        <p>Security & Surveillance</p>
                    </div>
                    <div className="sector-card iron-steel">
                        <p>Iron & Steel</p>
                    </div>
                    <div className="sector-card packaging">
                        <p>Packaging</p>
                    </div>
                </div>

            </section>

            {/* About Us Section */}
            <section className="about-us">
                <h2>About Us</h2>
                <p>
                    As EKO Innovation & Trading S.L., we are a consultancy and project
                    development firm operating in 6 different sectors on an international
                    scale. Our goal is to optimize business processes, reduce costs, and
                    develop sustainable projects for the future by offering our clients
                    the most innovative and efficient solutions.
                </p>
                <a href="#" className="read-more">About Us &rarr;</a>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">EKO Innovation</div>
                    <div className="footer-links">
                        <h3>Sectors</h3>
                        <ul>
                            <li>Smart City</li>
                            <li>Energy</li>
                            <li>ITS & Traffic</li>
                            <li>Security & Surveillance</li>
                            <li>Iron & Steel</li>
                            <li>Packaging</li>
                        </ul>
                    </div>
                    <div className="social-media">
                        <h3>Follow Us</h3>
                        <ul>
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>YouTube</li>
                            <li>LinkedIn</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
