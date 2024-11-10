import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AddProductForm.scss';

const UpdateProductForm = () => {
    const { id } = useParams(); // URL'den ürün ID'sini alıyoruz
    const [product, setProduct] = useState({});
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axios.get(`/api/get-product?id=${id}`);
            setProduct(response.data);
            setName(response.data.name);
            setPrice(response.data.price);
            setDescription(response.data.description);
            setTags(response.data.category.split(','));
        };
        fetchProduct();
    }, [id]);

    const handleUpdateProduct = async () => {
        try {
            const productData = {
                id,
                name,
                price,
                description,
                category: tags.join(',')
            };

            await axios.post('/api/update-product', productData);
            alert("Ürün başarıyla güncellendi.");

            // Resim ekleme işlemi
            const formData = new FormData();
            images.forEach(image => formData.append('image', image));
            await axios.post('/api/add-image', formData);

        } catch (error) {
            console.error("Ürün güncellenirken hata oluştu:", error);
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    return (
        <div>
            <h2>Update Product</h2>
            <input
                type="text"
                placeholder="Enter name of product"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Set price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input type="file" multiple onChange={handleImageChange} />
            <button onClick={handleUpdateProduct}>Update product</button>
        </div>
    );
};

export default UpdateProductForm;
