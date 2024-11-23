import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import SectorsSideMenu from '../components/sectors-side-menu/SectorsSideMenu';
import AdminProductCard from '../components/product-card/AdminProductCard';
import './productsPage.scss';
import { LoadProducts, DeleteProduct } from '../services/ProductService';
import { EditProductModal } from '../components/modals/EditProductModal';
import { AddProductModal } from '../components/modals/AddProductModal';
import InfoModal from '../components/modals/InfoModal';
import Pagination from '../components/pagination/Pagination';

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
    const handleEditProduct = (productId) => {
        setEditProductId(productId);
        setShowEditModal(true);
    };
    const handleDeleteProduct = async (productId) => {
        try {
            await DeleteProduct(productId);
            await updateProducts();
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

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
                        productId={editProductId}
                        onClose={() => setShowEditModal(false)}
                        onProductUpdated={updateProducts}
                    />,
                    document.body
                )}
            {deleteProductId &&
                createPortal(
                    <InfoModal
                        title="Delete Product"
                        subtitle="Are you sure you want to delete this product?"
                        onConfirm={() => {
                            handleDeleteProduct(deleteProductId);
                            setDeleteProductId(null);
                        }}
                        onClose={() => setDeleteProductId(null)}
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
        <>
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
                            handleEdit={() => handleEditProduct(product.id)}
                            handleDelete={() => setDeleteProductId(product.id)}
                        />
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </section>
        </>
    );
};

export default ProductsForAdmin;
