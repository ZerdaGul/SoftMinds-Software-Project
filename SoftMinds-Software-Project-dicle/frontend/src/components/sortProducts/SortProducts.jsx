import React, { useState } from 'react';
import './sortProducts.scss'; // Add styles for the dropdown if needed
import sort_icon from '../../assets/icons/sort.svg';

const SortProducts = ({ sortOrder, setSortOrder, sortBy, setSortBy }) => {

  // Handle changes in the dropdown
  const handleSortChange = (event) => {
    const [by, order] = event.target.value.split('-');
    setSortBy(by);
    setSortOrder(order); // Close dropdown on selection
  };

  return (
    <div className="sort-by-dropdown">
        <select
          id="sort"
          className="sort-by-dropdown__label"
          onChange={handleSortChange}
          value={`${sortBy}-${sortOrder}`}
        >
          <option value="name-asc" >Sort By</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity-asc">Popularity: Low to High</option>
          <option value="popularity-desc">Popularity: High to Low</option>
        </select>
    </div>
  );
};

export default SortProducts;
