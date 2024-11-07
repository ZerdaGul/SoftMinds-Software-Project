import React, { useState } from 'react';
import './sortProducts.scss'; // Add styles for the dropdown if needed
import sort_icon from '../../assets/icons/sort.svg';

const SortProducts = ({ sortOrder, setSortOrder, sortBy, setSortBy }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Handle changes in the dropdown
  const handleSortChange = (event) => {
    const [by, order] = event.target.value.split('-');
    setSortBy(by);
    setSortOrder(order);
    setIsDropdownVisible(false); // Close dropdown on selection
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Label rendering logic
  const renderSortLabel = () => {
    const labelMap = {
      'name-asc': 'Name: A to Z',
      'name-desc': 'Name: Z to A',
      'price-asc': 'Price: Low to High',
      'price-desc': 'Price: High to Low',
      'popularity-asc': 'Popularity: Low to High',
      'popularity-desc': 'Popularity: High to Low',
    };
    return labelMap[`${sortBy}-${sortOrder}`] || 'Sort By';
  };

  return (
    <div className="sort-by-dropdown">
      {/* Clickable area with the icon and label */}
      <div className="sort-by-dropdown__label" onClick={toggleDropdown}>
        <img src={sort_icon} alt="sort-icon" className="sort-by-dropdown__icon" />
        {renderSortLabel()}
      </div>

      {/* Dropdown options */}
      {isDropdownVisible && (
        <div className="sort-by-dropdown__options">
          <select
            id="sort"
            className="sort-by-dropdown__select"
            onChange={handleSortChange}
            value={`${sortBy}-${sortOrder}`}
          >
            <option value="" disabled>Sort By</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity-asc">Popularity: Low to High</option>
            <option value="popularity-desc">Popularity: High to Low</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SortProducts;
