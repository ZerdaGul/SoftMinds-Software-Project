import React, { useEffect, useState } from "react";
import product_pic from '../../assets/product-pic-default.jpg';
import '../product-card/productCard.scss';


const ProductImage = ({ photoUrl, name }) => {
  const [imageSrc, setImageSrc] = useState(product_pic); // Default to the fallback image
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateImageUrl = async () => {
      if (photoUrl) {

        try {
          const response = await fetch(photoUrl, { method: "GET" });

          if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
            setImageSrc(photoUrl); // Use the provided URL if valid
          } else {
            setError("Invalid image response.");
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Image validation error:", err);
            setError(err.message);
          }
        }
      }
    };

    validateImageUrl();

  }, [photoUrl]);

  return (
    <div>
      <img src={imageSrc} alt={name} className="productCard__image" />
    </div>
  );
};

export default ProductImage;

