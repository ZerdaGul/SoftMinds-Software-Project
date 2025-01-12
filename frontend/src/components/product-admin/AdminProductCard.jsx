import React, { useState } from 'react';
import '../product-card/productCard.scss';
import product_pic from '../../assets/product-pic-default.jpg';
import ProductImage from '../product-page/ProductImage';
import {DeleteProduct} from "../../services/ProductAdminService"; // Varsayılan ürün resmi

const AdminProductCard = ({ product, handleEdit, handleDelete }) => {
    const [showConfirmation, setShowConfirmation] = useState(false); // Popup kontrolü

    const handleEditClick = (e) => {
        e.stopPropagation();
        handleEdit(product); // Düzenleme işlemini tetikleyin
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        handleDelete(product.id);
    };

    const cancelDelete = (e) => {
        e.stopPropagation();
        setShowConfirmation(false); // Popup iptal edilir
    };

    return (
        <div className="productCard">
            <ProductImage 
                photoUrl={product.photoUrl}
                name={product.name}
            />

            <div className="productCard__wrapper">
                <div className="productCard__title">{product?.name}</div>
                <div className="productCard__price">${product?.price}</div>
                <div className="productCard__actions">
                    <button
                        onClick={handleEditClick}
                        className="button button__small button__edit"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDeleteClick}
                        className="button button__small button__delete"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Popup Modal */}
            {/*{showConfirmation && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this product?</p>
                        <div className="modal-buttons">
                            <button
                                onClick={() => {
                                    handleDelete(product.id); // Ürünü sil
                                    setShowConfirmation(false); // Popup kapanır
                                }}
                                className="button button__confirm"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="button button__cancel"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}*/}
        </div>
    );
};

export default AdminProductCard;
