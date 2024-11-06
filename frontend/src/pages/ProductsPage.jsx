import React, { useState } from 'react'

import SectorsSideMenu from '../components/sectors-side-menu/SectorsSideMenu'
import ProductCard from '../components/profuct-card/ProductCard';
import './productsPage.scss';

const products = [
	{
	  name: "Wireless Earbuds Pro",
	  price: 129.99,
	  description: "High-quality sound with noise cancellation and a comfortable fit for all-day wear."
	},
	{
	  name: "Smartwatch Series 5",
	  price: 249.99,
	  description: "Features include heart rate monitoring, GPS, and over 20 fitness tracking modes."
	},
	{
	  name: "Portable Charger 20000mAh",
	  price: 34.99,
	  description: "Compact and high-capacity portable charger with fast charging capability for smartphones and tablets."
	},
	{
	  name: "Bluetooth Speaker",
	  price: 79.99,
	  description: "Waterproof portable speaker with deep bass and 12-hour playtime, perfect for outdoor activities."
	},
	{
	  name: "Gaming Headset",
	  price: 59.99,
	  description: "Over-ear gaming headset with surround sound, noise-canceling mic, and RGB lighting effects."
	},
	{
	  name: "4K Streaming Stick",
	  price: 49.99,
	  description: "Stream in stunning 4K UHD with access to all major streaming services and voice control."
	},
	{
	  name: "Smart Home Hub",
	  price: 99.99,
	  description: "Control all your smart home devices from one hub, compatible with voice assistants and Wi-Fi enabled."
	},
	{
	  name: "Portable SSD 1TB",
	  price: 119.99,
	  description: "Ultra-fast, shock-resistant external SSD with USB-C for easy transfer of large files."
	},
	{
	  name: "Wireless Charging Pad",
	  price: 29.99,
	  description: "10W wireless charger for compatible smartphones, featuring a sleek and compact design."
	},
	{
	  name: "Drone with Camera",
	  price: 399.99,
	  description: "Capture stunning 4K footage with this easy-to-fly drone, equipped with GPS stabilization and a 3-axis gimbal."
	},
	{
	  name: "Smart Thermostat",
	  price: 149.99,
	  description: "Energy-efficient thermostat with smart scheduling, remote control, and energy usage insights."
	},
	{
	  name: "Mechanical Keyboard",
	  price: 89.99,
	  description: "RGB-backlit mechanical keyboard with customizable keys and durable switches for gaming and productivity."
	}
  ];
  


const ProductsPage = () => {
	const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);


	return (
		<>
			<SectorsSideMenu 
				filter={filter}
				onFilter={setFilter}/>
			<section className='products__page'>
				<div className="products__sorting"></div>
				<div className="products__list">
					{products.map(product => (
						<ProductCard onClick={()=>showModal(true)}product={product}/>
					))}
				</div>
			</section>
		</>
	)
}

export default ProductsPage