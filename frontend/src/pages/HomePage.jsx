
import { Link } from 'react-router-dom';

import smartCityImg from '../assets/img/SmartCity.png';
import energyImg from '../assets/img/energy.png';
import itsTrafficImg from '../assets/img/ITS.png';
import securitySurveillanceImg from '../assets/img/Security.png';
import ironSteelImg from '../assets/img/IronSteel.webp';
import packagingImg from '../assets/img/Packaging.jpg';
import './HomePage.scss';
import ContactForm from '../components/contact-form/ContactForm';
import React, { useEffect, useState } from "react";

const sectors = [
    {
        sector: 'Smart City',
        descr: 'Innovative solutions for urban development, integrating technology to improve infrastructure, communication, and sustainability.',
        picture: smartCityImg,
    },
    {
        sector: 'Energy',
        descr: 'Cutting-edge approaches to energy generation, storage, and distribution, focusing on renewable and sustainable resources.',
        picture: energyImg,
    },
    {
        sector: 'ITS & Traffic',
        descr: 'Intelligent Transportation Systems to enhance traffic management, safety, and efficiency in transportation networks.',
        picture: itsTrafficImg,
    },
    {
        sector: 'Security & Surveillance',
        descr: 'Advanced security and surveillance technologies to ensure safety and monitor critical areas effectively.',
        picture: securitySurveillanceImg,
    },
    {
        sector: 'Iron & Steel',
        descr: 'High-quality solutions for the iron and steel industry, driving innovation in materials and production.',
        picture: ironSteelImg,
    },
    {
        sector: 'Packaging',
        descr: 'Innovative packaging solutions designed for efficiency, sustainability, and adaptability across industries.',
        picture: packagingImg,
    },
];


function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/homepage/featured-products");
                if (!response.ok) {
                    throw new Error("Something went wrong while fetching products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Innovative Solutions to Empower Businesses</h1>
                    <Link to="/sectors" className="button">
                        Learn More
                    </Link>
                </div>
            </section>

            {/* New Products Section */}
            <section className="new-products">
            <h2>Featured Products</h2>
            <div className="products">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img
                            src="https://via.placeholder.com/150" // Placeholder image
                            alt={product.name}
                        />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

            {/* Sectors Section */}
            <section className="sectors" id='sectors'>
                <div className="container">
                    <h2>Sectors</h2>
                    <div className=" sector-cards">
                        {sectors.map(({sector, descr, picture}) => {
                            return(
                            <div key={sector} className="sector-card">
                                <img className='sector-img' src={picture} alt={sector} />
                                <div >
                                <Link to="/sectors" className="sector-name" >
                                    {sector}
                                </Link>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

            </section>

            {/* About Us Section */}
            <section className="about-us">
                <div className="container">
                    <h3 className='about-us-title'>About Us</h3>
                    <div className='about-us-text'>
                        As EKO Innovation & Trading S.L., we are a consultancy and project
                        development firm operating in 6 different sectors on an international
                        scale. Our goal is to optimize business processes, reduce costs, and
                        develop sustainable projects for the future by offering our clients
                        the most innovative and efficient solutions.
                    </div>
                    <Link to='/aboutUs' className="read-more">Learn more →</Link>
                </div>
            </section>

            <ContactForm/>


        </div>
    );
}

export default HomePage;
