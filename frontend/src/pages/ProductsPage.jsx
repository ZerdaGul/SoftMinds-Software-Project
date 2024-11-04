import React, { useState } from 'react'

import SectorsSideMenu from '../components/sectors-side-menu/SectorsSideMenu'


const ProductsPage = () => {
	const [filter, setFilter] = useState('All');

	return (
		<>
			<SectorsSideMenu 
				filter={filter}
				onFilter={setFilter}/>
			<section className='products_list'></section>
		</>
	)
}

export default ProductsPage