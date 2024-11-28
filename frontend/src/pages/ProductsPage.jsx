import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SectorsSideMenu from '../components/sectors-side-menu/SectorsSideMenu'
import ProductCard from '../components/product-card/ProductCard';
import './productsPage.scss';
import { LoadProducts } from '../services/ProductService';
import SetQuantityModal from '../components/modals/SetQuantityModal';
import InfoModal from '../components/modals/InfoModal';
import SortProducts from '../components/sortProducts/SortProducts';
import Pagination from '../components/pagination/Pagination';
import { SearchProducts } from '../services/ProductService';
import Search from '../components/search/Search';


const ProductsPage = () => {
	const navigate = useNavigate();
  	const location = useLocation();

	// Initialize state from location or set default values
	const [filter, setFilter] = useState( location.state?.filter || 'All');
	const [sortBy, setSortBy] = useState(location.state?.sortBy || '');
	const [sortOrder, setSortOrder] = useState(location.state?.sortOrder || '');
	const [currentPage, setCurrentPage] = useState(location.state?.currentPage || 1);

	const [products, setProducts] = useState([]);
	const [totalPages, setTotalPages] = useState();
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [query, setQuery]=useState('');
	const [reset, setReset] = useState(false);

	const [productToBuy, setProductToBuy] = useState(0);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		updateProducts();
	}, [filter,sortOrder, sortBy, currentPage])

	const onLoaded =(data) => {
        setProducts(data.products);
		setTotalPages(data.totalPages);
    }

    const onError = (error) => {
        setError(true);  
        setShowModal(true);
        setErrorMessage(error.message)      
    }
    const updateProducts = async () => {
        try {
            const data = await LoadProducts({sector: filter, sortOrder, sortBy, pageNumber:currentPage});
            onLoaded(data);
        } catch (error) {
            onError(error); // Handle error
        }
    };

	const handleAddToCart = (id) => {
		setProductToBuy(id);
		setShowModal(true)
	}

	const handlePageChange = (current, direction=0) => {
		setCurrentPage(current+direction);
	}

	const handleProductClick = (productId) => {
		// Navigate to the single product page, preserving state
		navigate(`/products/${productId}`, {
			state: { filter, sortBy, sortOrder, currentPage },
		});
	};

	const handleSearch = async (query) => {
		setQuery(query);
		if(query){
			try{
				const data = await SearchProducts({keyword: query, pageNumber: currentPage});
				onLoaded(data);
				setReset(true);
			} catch (error) {
				onError(error);
			}
		} else {
			setReset(false);
			updateProducts();
		}
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
		<div className='container'>
				{showModal && modal}
				
				{!query && <SectorsSideMenu 
					filter={filter}
					onFilter={setFilter}/>}

				<section className='products__page'>
					
					<div className="products__control">
					{!query &&<SortProducts
						sortBy={sortBy}
						setSortBy={setSortBy}
						sortOrder={sortOrder}
						setSortOrder={setSortOrder}
						/>}
						<Search
							reset={reset}
							onSearch={handleSearch}
						/>
					</div>
					<div className="products__list">
						{products.map(product => (
							<ProductCard 
								handleAddToCart={handleAddToCart}
								key={product.id}
								product={product}
								onClick={() => handleProductClick(product.id)}/>
						))}
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}/>
				</section>
				</div>
			
		
	)
}

export default ProductsPage