import React, { useState } from 'react';
import './AddEditProductModal.scss';
import { EditProduct } from '../../services/ProductAdminService'; // API function import
import closeButton from '../../assets/icons/close-dark.svg'

export const EditProductModal = ({ product, onClose, onProductUpdated, onError }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [description, setDescription] = useState(product.description);
    const [stock, setStock] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoType, setPhotoType] = useState('');
    const [photoSize, setPhotoSize] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Track loading state
    const { id, sector} = product;

    const handleSubmit = async () => {
        if (!name || !price || !description || !stock || !sector) {
            setError('Tüm alanları doldurmanız gerekmektedir.');
            return;
        }
    
        // Prepare the object
        const productData = {
            id: id,
            ProductName: name,
            Description: description,
            price: price,
            stock: stock,
            Sector: sector,
            photo: "", // This will hold the byte array
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
        
    
        console.log(productData); // Check the object content before sending
    

        try {
            setLoading(true);
            const response = await EditProduct(productData); // Pass FormData to the API
            onProductUpdated(); // Notify parent component with updated product
            resetForm();
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error updating product:', err.message);
            setError(err.message);
            onError(error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <img src={closeButton} alt="close" />
                </button>
                <h2>Update Product</h2>
                <form>
                    <label>Name</label>
                    <input
                        type="text"
                        disabled={true}
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
                    <label>Update Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Enter stock value"
                    />
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
                    {/* <label>Add Photos</label>
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
                    </div> */}
                </form>
                <button
                    style={{marginTop: "15px"}}
                    className="button button__long submit-button"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
            </div>
        </div>
    );
};
