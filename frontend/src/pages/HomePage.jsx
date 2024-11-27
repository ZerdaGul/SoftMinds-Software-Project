import React from 'react';
import { Link } from 'react-router-dom';

import smartCityImg from '../assets/img/SmartCity.png';
import energyImg from '../assets/img/energy.png';
import itsTrafficImg from '../assets/img/ITS.png';
import securitySurveillanceImg from '../assets/img/Security.png';
import ironSteelImg from '../assets/img/IronSteel.webp';
import packagingImg from '../assets/img/Packaging.jpg';
import forward from '../assets/icons/arrow-forward-red.svg'
import './HomePage.scss';
import ContactForm from '../components/contact-form/ContactForm';


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
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Innovative Solutions to Empower Businesses</h1>
                    <button className="button">Learn more</button>
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
            <section className="sectors" id='sectors'>
                <div className="container">
                    <h2>Sectors</h2>
                    <div className=" sector-cards">
                        {sectors.map(({sector, descr, picture}) => {
                            return(
                            <div key={sector} className="sector-card">
                                <img className='sector-img' src={picture} alt={sector} />
                                <div className="sector-name">{sector}</div>
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
                    <Link to='/aboutUs' className="read-more">Learn more <img src={forward} alt="arrow-froward" /></Link>
                </div>
            </section>

            <ContactForm/>

            
        </div>
    );
}

export default HomePage;
