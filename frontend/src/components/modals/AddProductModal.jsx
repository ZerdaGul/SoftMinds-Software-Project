import React, { useState } from 'react';
import './AddEditProductModal.scss';
import { AddProduct } from '../../services/ProductAdminService';
import defaultPhoto from '../../assets/product-pic-default.jpg';

export const AddProductModal = ({ onClose, onProductAdded }) => {
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
        'Smart City',
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
            if (file.size > 2 * 1024 * 1024) { // 2MB max file size
                setError('File size must be less than 2MB.');
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Only JPEG and PNG images are allowed.');
                return;
            }
            setPhoto(file);
            setPhotoType(file.type); // Get the file's type
            setPhotoSize(file.size); // Get the file's size
            setError('');
        }
    };

    const handleRemovePhoto = (e) => {
        e.preventDefault();
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

    // Convert image to base64
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
        if (!name || !price || !description || !stock || !sector) {
            setError('Tüm alanları doldurmanız gerekmektedir.');
            return;
        }

        if (isNaN(price) || price <= 0) {
            setError('Geçerli bir fiyat girin.');
            return;
        }

        if (isNaN(stock) || stock <= 0) {
            setError('Geçerli bir stok değeri girin.');
            return;
        }

        const productData = {
            productName: name,
            description: description,
            price: price,
            stock: stock,
            sector: sector,
            photo: '', // Base64 encoded image string
            contentType: 'image/jpeg', // Default MIME type if no photo
        };

        // If there's a photo, convert it to base64 and append it
        if (photo) {
            const base64Image = await convertImageToBase64(photo);
            productData.photo = base64Image; // Send base64 encoded string as photo
            productData.contentType = photo.type; // Send photo type
        }

        setIsSubmitting(true);
        setError(''); // Reset error before submitting

        try {
            await AddProduct(productData); // Assuming AddProduct is correctly defined in services
            onProductAdded(); // Notify the parent component
            resetForm(); // Reset form fields
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error Response:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Ürün eklenirken bir hata oluştu.');
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div className="overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <h2>Add Product</h2>
                <form>
                    {error && <p className="error-message">{error}</p>}
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
                        {sector && <p>Selected Sector: {sector}</p>}
                    </div>
                    <div className="form-group">
                        <label>Photo</label>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                        {photo && (
                            <div className="photo-preview">
                                <img src={URL.createObjectURL(photo)} alt="preview" />
                                <p>Type: {photoType}</p>
                                <p>Size: {(photoSize / 1024).toFixed(2)} KB</p>
                                <button onClick={handleRemovePhoto}>Remove Photo</button>
                            </div>
                        )}
                    </div>
                </form>
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Add Product'}
                </button>
            </div>
        </div>
    );
};
