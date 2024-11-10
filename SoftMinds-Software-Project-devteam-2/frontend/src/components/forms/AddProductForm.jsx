import React, { useState } from 'react';
import axios from 'axios';
import './AddProductForm.scss';

const categories = ["Energy", "Iron & Steel", "ITS & Traffic", "Packaging", "Security & Survellience", "Smart City"];

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleAddProduct = async () => {
        try {
            const productData = {
                name,
                price,
                description,
                category: selectedCategory,
            };

            const response = await axios.post('/api/add-product', productData);
            alert(response.data);

            // Resim ekleme işlemi
            const formData = new FormData();
            images.forEach(image => formData.append('image', image));
            await axios.post('/api/add-image', formData);

        } catch (error) {
            console.error("Ürün eklenirken hata oluştu:", error);
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    return (
        <div className="form-container">
            <h2>Add Product</h2>
            <label>Name</label>
            <input
                type="text"
                placeholder="Enter name of product"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>Price</label>
            <input
                type="text"
                placeholder="Set price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <label>Description</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label>Pick sector</label>
            <div className="tag-container">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`tag ${selectedCategory === category ? "selected" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </div>
                ))}
            </div>
            <label>Photos</label>
            <div className="file-input">
                <span className="icon">+</span>
                <span>Add Photos</span>
                <input type="file" multiple onChange={handleImageChange} />
            </div>
            <button className="submit-button" onClick={handleAddProduct}>Add new product</button>
        </div>
    );
};

export default AddProductForm;
