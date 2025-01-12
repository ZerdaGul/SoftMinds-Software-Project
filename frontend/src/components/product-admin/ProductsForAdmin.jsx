import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import SectorsSideMenu from '../sectors-side-menu/SectorsSideMenu';
import AdminProductCard from './AdminProductCard';
import '../../pages/productsPage.scss';
import { LoadProducts } from '../../services/ProductService';
import { DeleteProduct } from '../../services/ProductAdminService';
import { EditProductModal } from '../modals/EditProductModal';
import { AddProductModal } from '../modals/AddProductModal';
import InfoModal from '../modals/InfoModal';
import Pagination from '../pagination/Pagination';
import ConfirmModal from '../modals/ConfirmModal';

const ProductsForAdmin = () => {
    const location = useLocation();

    const [filter, setFilter] = useState(location.state?.filter || 'All');
    const [currentPage, setCurrentPage] = useState(location.state?.currentPage || 1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);

    useEffect(() => {
        updateProducts();
    }, [filter, currentPage]);

    const updateProducts = async () => {
        try {
            const data = await LoadProducts({ sector: filter, pageNumber: currentPage });
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    const handleAddProduct = () => setShowAddModal(true);

    const handleEditProduct = (product) => {
        setEditProductId(product);
        setShowEditModal(true);
    };
    const handleDeleteProduct = async (productId) => {
        try {
            await DeleteProduct(productId);
            updateProducts();
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };
    const handlePageChange = (current, direction=0) => {
		setCurrentPage(current+direction);
	}

    const modal = (
        <>
            {showAddModal &&
                createPortal(
                    <AddProductModal
                        onClose={() => setShowAddModal(false)}
                        onProductAdded={updateProducts}
                    />,
                    document.body
                )}
            {showEditModal &&
                createPortal(
                    <EditProductModal
                        product={editProductId}
                        onClose={() => setShowEditModal(false)}
                        onProductUpdated={updateProducts}
                    />,
                    document.body
                )}
            {deleteProductId &&
                createPortal(
                    <ConfirmModal
                        title="Delete Product"
                        subtitle="Are you sure you want to delete this product?"
                        onConfirm={() => {
                            handleDeleteProduct(deleteProductId); // Silme işlemi
                            setDeleteProductId(null); // Modal kapatılır
                        }}
                        onClose={() => setDeleteProductId(null)} // Modal kapatılır
                        buttonConfirmText = {"Delete"}
                        buttonCloseText ={'Cancel'}
                        />,
                    document.body
                )}
            {error &&
                createPortal(
                    <InfoModal
                        title="Error"
                        subtitle={errorMessage}
                        onClose={() => setError(false)}
                    />,
                    document.body
                )}
        </>
    );

    return (
        <div className='container'>
            {modal}
            <SectorsSideMenu filter={filter} onFilter={setFilter} />
            <section className="products__page">
                <div className="products__control">
                    <button className="add-product-btn" onClick={handleAddProduct}>
                        Add New Product
                    </button>
                </div>
                <div className="products__list">
                    {products.map((product) => (
                        <AdminProductCard
                            key={product.id}
                            product={product}
                            handleEdit={() => handleEditProduct(product)}
                            handleDelete={() => setDeleteProductId(product.id)}
                        />
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </div>
    );
};

export default ProductsForAdmin;
