import React, { useState } from 'react';
import './AddEditProductModal.scss';
import { AddProduct } from '../../services/ProductAdminService';
import defaultPhoto from '../../assets/product-pic-default.jpg';

import closeButton from '../../assets/icons/close-dark.svg'

export const AddProductModal = ({ onClose, onProductAdded, onError }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [sector, setSector] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoType, setPhotoType] = useState('');
    const [photoSize, setPhotoSize] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectors = [
        'Smart Cities',
        'Energy',
        'ITS & Traffic',
        'Security & Surveillance',
        'Iron & Steel',
        'Packaging',
    ];

    const handleSectorSelect = (selectedSector) => {
        setSector(selectedSector);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoType(file.type); // Fotoğraf türü
            setPhotoSize(file.size); // Fotoğraf boyutu
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPhotoType('');
        setPhotoSize(0);
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setStock('');
        setSector('');
        setPhoto(null);
        setPhotoType('');
        setPhotoSize(0);
        setError('');
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]); // Get Base64 part of Data URL
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); // Read as Data URL to extract Base64
        });
    };
    

      const handleSubmit = async () => {
        if (!name || !price || !description || !stock || !sector) {
            setError('Tüm alanları doldurmanız gerekmektedir.');
            return;
        }
    
        // Prepare the object
        const productData = {
            id: 0,
            productName: name,
            description: description,
            price: price,
            stock: stock,
            sector: sector,
            photo: '', // This will hold the byte array
            contentType: '', // Content type for the photo (e.g., image/jpeg, image/png)
        };
    
        if (photo) {
            try {
                const base64Photo = await convertToBase64(photo);
                productData.photo = base64Photo; // Set the Base64-encoded photo
                productData.contentType = photoType; // Set the content type
            } catch (err) {
                setError('Error converting image to Base64.');
                return;
            }
        }
    
        try {
            setIsSubmitting(true);
            const response = await AddProduct(productData); // Send the data as JSON
            onProductAdded();
            resetForm();
            onClose();
        } catch (err) {
            console.error("Error Response:",err.message);
            setError(err.message || 'Ürün eklenirken bir hata oluştu.');
            onError(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <img src={closeButton} alt="close" />
                </button>
                <h2>Add Product</h2>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Set product price"
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
                        <label>Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Set stock amount"
                        />
                    </div>
                    <div className="form-group">
                        <label>Select Sector</label>
                        <div className="sector-buttons">
                            {sectors.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`sector-button ${sector === s ? 'selected' : ''}`}
                                    onClick={() => handleSectorSelect(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Photo</label>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                        {photo && (
                            
                            <div className="photo-preview">
                                <div className="photo-wrapper">
                                    <img src={URL.createObjectURL(photo)} alt="preview" />
                                    <button className='photo-remove' onClick={handleRemovePhoto}>
                                        <img src={closeButton} alt="close" />
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </form>
                <button
                    style={{marginTop: "15px"}}
                    className="button button__long submit-button" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Add Product'}
                </button>
            </div>
        </div>
    );
};
