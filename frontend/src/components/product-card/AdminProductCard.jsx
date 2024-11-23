import React from 'react';
import './productCard.scss';
import product_pic from '../../assets/product-pic-default.jpg'; // Varsayılan ürün resmi
import editIcon from '../../assets/icons/edit-icon.webp'; // Edit ikonu
import deleteIcon from '../../assets/icons/delete-icon.png'; // Delete ikonu

const AdminProductCard = ({ product, handleEdit, handleDelete }) => {
    const handleEditClick = (e) => {
        e.stopPropagation(); // Tıklamanın kartın diğer click eventine geçmesini engeller
        handleEdit(product.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Tıklamanın kartın diğer click eventine geçmesini engeller
        handleDelete(product.id);
    };

    return (
        <div className="productCard">
            <img
                src={product.imageUrl || product_pic} // Eğer `product.imageUrl` yoksa varsayılan resmi göster
                alt={product.name || "Product Image"}
                className="productCard__image"
            />

            <div className="productCard__wrapper">
                <div className="productCard__title">{product.name}</div>
                <div className="productCard__price">${product.price}</div>
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
        </div>
    );
};

export default AdminProductCard;
