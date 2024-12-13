import React, { useState } from 'react';
import './AddEditProductModal.scss';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Tik ve çarpı ikonları
import { AddProduct } from '../../services/ProductService'; // API çağrısı için servis

export const AddProductModal = ({ onClose, onProductAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [sector, setSector] = useState(''); // Tek bir string olarak sektör
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState('');

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setPhotos([...photos, ...files]);
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
    };

    const handleSubmit = async () => {
        // Form doğrulama
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

        try {
            const formData = new FormData();
            formData.append('ProductName', name);
            formData.append('Price', price);
            formData.append('Description', description);
            formData.append('Stock', stock);
            formData.append('Sector', sector); // Tek bir string olarak sektör

            // Fotoğraf ekleme
            if (photos.length > 0) {
                formData.append('Photo', photos[0]); // İlk fotoğrafı gönder
                formData.append('ContentType', photos[0].type); // Fotoğraf MIME türü
            }

            // API'ye form verisini gönder
            await AddProduct(formData);

            onProductAdded(); // Ürün listesi güncellenir
            onClose(); // Modal kapatılır
        } catch (err) {
            setError('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
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
                        <label>Sector</label>
                        <input
                            type="text"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            placeholder="Enter sector (e.g., 'Smart City, Energy')"
                        />
                    </div>
                    <div className="form-group">
                        <label>Add Photos</label>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
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
                <button className="submit-button" onClick={handleSubmit}>
                    Add Product
                </button>
            </div>
        </div>
    );
};
