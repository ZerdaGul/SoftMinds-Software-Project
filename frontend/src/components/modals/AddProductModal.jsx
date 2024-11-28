import React, { useState } from 'react';
import './AddEditProductModal.scss';

import { FaCheck, FaTimes } from 'react-icons/fa'; // Font Awesome'dan tik ve çarpı ikonları

export const AddProductModal = ({ onClose, onProductAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSectors, setSelectedSectors] = useState([]);
    const [photos, setPhotos] = useState([]);

    const allSectors = ['Smart City', 'Energy', 'ITS & Traffic', 'Security & Surveillance', 'Iron & Steel', 'Packaging'];

    const handleSectorToggle = (sector) => {
        if (selectedSectors.includes(sector)) {
            setSelectedSectors(selectedSectors.filter((s) => s !== sector));
        } else {
            setSelectedSectors([...selectedSectors, sector]);
        }
    };

    const handleSubmit = () => {
        const newProduct = { name, price, description, sectors: selectedSectors, photos };
        onProductAdded(newProduct);
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
        <div className="overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Add Product</h2>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name of product"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Set price"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description"
                        />
                    </div>
                    <div className="form-group">
                        <label>Pick Sectors</label>
                        <div className="sector-buttons">
                            {allSectors.map((sector) => (
                                <button
                                    key={sector}
                                    type="button"
                                    className={`sector-button ${selectedSectors.includes(sector) ? 'selected' : ''}`}
                                    onClick={() => handleSectorToggle(sector)}
                                >
                                    {sector}{' '}
                                    {selectedSectors.includes(sector) ? (
                                        <FaCheck className="icon" />
                                    ) : (
                                        <FaTimes className="icon" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
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
                    </div>
                </form>
                <button className="submit-button" onClick={handleSubmit}>Add new product</button>
            </div>
        </div>
    );
};
