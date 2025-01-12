import React, { useState } from 'react';
import './AddEditProductModal.scss';
import { EditProduct } from '../../services/ProductAdminService'; // API function import

export const EditProductModal = ({ product, onClose, onProductUpdated }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [description, setDescription] = useState(product.description);
    const [sector, setSector] = useState(product.sector);
    const [photo, setPhotos] = useState([]); // Will hold uploaded photo files
    const [loading, setLoading] = useState(false); // Track loading state
    const { id, stock } = product;

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('productName', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('sector', sector);
        formData.append("contentType", '');

        // Append each photo to the formData
        photo.forEach((file, index) => {
            formData.append(`photo[${index}]`, file); // Include all photos in the request
        });

        try {
            setLoading(true);
            const response = await EditProduct(id, formData); // Pass FormData to the API
            onProductUpdated(response); // Notify parent component with updated product
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating product:', error.message);
            alert('An error occurred while updating the product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setPhotos([...photo, ...files]);
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = photo.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
    };

    return (
        <div className="overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Update Product</h2>
                <form>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name of product"
                    />
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Set price"
                    />
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                    />
                    <label>Pick Sector</label>
                    <input
                        type="text"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Enter sector"
                    />
                    <label>Add Photos</label>
                    <input type="file" multiple onChange={handlePhotoUpload} />
                    <div className="photo-preview">
                        {photo.map((file, index) => (
                            <div key={index} className="photo-item">
                                <img src={URL.createObjectURL(file)} alt="preview" />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </form>
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
            </div>
        </div>
    );
};
