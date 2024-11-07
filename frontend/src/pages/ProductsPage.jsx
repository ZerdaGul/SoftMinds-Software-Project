import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import SectorsSideMenu from '../components/sectors-side-menu/SectorsSideMenu'
import ProductCard from '../components/product-card/ProductCard';
import './productsPage.scss';
import { LoadProducts } from '../services/ProductService';
import SetQuantityModal from '../components/modals/SetQuantityModal';
import InfoModal from '../components/modals/InfoModal';
import SortProducts from '../components/sortProducts/SortProducts';



const ProductsPage = () => {
	const [filter, setFilter] = useState('All');
	const [productToBuy, setProductToBuy] = useState(0);
    const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
	const [products, setProducts] = useState([]);
	const [sortBy, setSortBy] = useState('name');
	const [sortOrder, setSortOrder] = useState('asc');

	useEffect(() => {
		updateProducts();
	}, [filter])

	const onLoaded =(data) => {
        setLoading(false);
        setProducts(data.products)
    }

    const onError = (error) => {
        setLoading(false);
        setError(true);  
        setShowModal(true);
        setErrorMessage(error.message)      
    }
    const updateProducts = async () => {
        setLoading(true);
        try {
            const data = await LoadProducts({sector: filter, sortOrder, sortBy});
            onLoaded(data);
        } catch (error) {
            onError(error); // Handle error
        }
    };

	const handleAddToCart = (id) => {
		setProductToBuy(id);
		setShowModal(true)
	}

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
		<div>
			{showModal && modal}
			<SectorsSideMenu 
				filter={filter}
				onFilter={setFilter}/>
			<section className='products__page'>
				
				{/* <div className="products__sorting"></div> */}
				<SortProducts
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					/>
				<div className="products__list">
					{products.map(product => (
						<ProductCard 
							handleAddToCart={handleAddToCart}
							key={product.id}
							product={product}/>
					))}
				</div>
			</section>
		</div>
	)
}

export default ProductsPage