
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import smartCityImg from '../assets/img/SmartCity.png';
import energyImg from '../assets/img/energy.png';
import itsTrafficImg from '../assets/img/ITS.png';
import securitySurveillanceImg from '../assets/img/Security.png';
import ironSteelImg from '../assets/img/IronSteel.webp';
import packagingImg from '../assets/img/Packaging.jpg';
import { LoadFeaturedProducts } from '../services/ProductService';
import './HomePage.scss';
import ContactForm from '../components/contact-form/ContactForm';
import ProductCard from '../components/product-card/ProductCard';
import SetQuantityModal from '../components/modals/SetQuantityModal';
import InfoModal from '../components/modals/InfoModal';


const sectors = [
    {
        sector: 'Smart Cities',
        picture: smartCityImg,
    },
    {
        sector: 'Energy',
        picture: energyImg,
    },
    {
        sector: 'ITS & Traffic',
        picture: itsTrafficImg,
    },
    {
        sector: 'Security & Survellience',
        picture: securitySurveillanceImg,
    },
    {
        sector: 'Iron & Steel',
        picture: ironSteelImg,
    },
    {
        sector: 'Packaging',
        picture: packagingImg,
    },
];


function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productToBuy, setProductToBuy] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const onLoaded =(data) => {
        setProducts(data);
    }

    const onError = (error) => {
        setError(true);  
        setShowModal(true);
        setErrorMessage(error.message)      
    }

    const loadFeaturedProducts = async() => {
        try {
            const data = await LoadFeaturedProducts();
            onLoaded(data);
        } catch (error) {
            onError(error); // Handle error
        }
    }
    const handleAddToCart = (id) => {
		setProductToBuy(id);
		setShowModal(true)
	}

	const handleProductClick = (productId) => {
		// Navigate to the single product page, preserving state
		navigate(`/products/${productId}`);
	};

    const modal = (
        <div>
			{productToBuy && 
				createPortal(
					<SetQuantityModal
						product_id={productToBuy}
						onClose={() => {
							setShowModal(false);
							setProductToBuy(0)
						}}
					/>,
					document.body
				)}
            {error &&
                createPortal(
                    <InfoModal
                        title="Error"
                        subtitle={errorMessage}
                        onClose={() => {
                            setShowModal(false);
                            setError(false);
                        }}
                    />,
                    document.body
                )}
            <div className="overlay"></div>
        </div>
    );

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
            {showModal && modal}
            <h2>Featured Products</h2>
            <div className="products">
                    {products.map(product => (
                        <ProductCard 
                            handleAddToCart={handleAddToCart}
                            key={product.id}
                            product={product}
                            onClick={() => handleProductClick(product.id)}/>
                    ))}
            </div>
        </section>

            {/* Sectors Section */}
            <section className="sectors" id='sectors'>
                <div className="container">
                    <h2>Sectors</h2>
                    <div className=" sector-cards">
                        {sectors.map(({sector, picture}) => {
                            return(
                            <div key={sector} className="sector-card">
                                <img className='sector-img' src={picture} alt={sector} />
                                <Link 
                                    to="/products" 
                                    state={{ filter: sector }} 
                                    className="sector-name"
                                    >
                                    {sector}
                                </Link>
                                
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

<div className="contact-form">
<ContactForm/>
</div>


        </div>
    );
}

export default HomePage;
