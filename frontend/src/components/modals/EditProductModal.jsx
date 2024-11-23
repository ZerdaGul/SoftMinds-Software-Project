import React, { useState } from 'react';
import './AddEditProductModal.scss';

export const EditProductModal = ({ product, onClose, onProductUpdated }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [description, setDescription] = useState(product.description);
    const [sectors, setSectors] = useState(product.sectors);
    const [photos, setPhotos] = useState(product.photos);

    const handleSubmit = () => {
        const updatedProduct = { ...product, name, price, description, sectors, photos };
        onProductUpdated(updatedProduct);
        onClose();
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setPhotos([...photos, ...files]);
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
    };

    return (
        <div className="modal">
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
                    <label>Pick Sectors</label>
                    <input
                        type="text"
                        value={sectors.join(', ')}
                        onChange={(e) => setSectors(e.target.value.split(','))}
                        placeholder="Enter sectors (comma-separated)"
                    />
                    <label>Add Photos</label>
                    <input type="file" multiple onChange={handlePhotoUpload} />
                    <div className="photo-preview">
                        {photos.map((photo, index) => (
                            <div key={index} className="photo-item">
                                <img src={URL.createObjectURL(photo)} alt="preview" />
                                <button onClick={() => handleRemovePhoto(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </form>
                <button className="submit-button" onClick={handleSubmit}>Update product</button>
            </div>
        </div>
    );
};
