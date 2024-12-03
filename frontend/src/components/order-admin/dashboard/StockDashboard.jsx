import React, { useEffect, useState } from "react";

import { LoadProducts } from "../../../services/ProductService";
import "./stockDashboard.scss";
import arrow from '../../../assets/icons/arrow-forward-orange.svg'

function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMore, setShowMore] = useState(true)
  const [totalPages, setTotalPages] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    updateStocks();
  }, [currentPage]);

  const onError = (error) => {
    setError(true);
    setShowModal(true);
    setErrorMessage(error.message);
  };

  const updateStocks = async () => {
    try {
      const data = await LoadProducts({ pageNumber: currentPage });
      setStocks((prevStocks) => [...prevStocks, ...data.products]);
      setTotalPages(data.totalPages);
    } catch (error) {
      onError(error); // Handle error
    }
  };

  const incrementPage = () => {

    if (currentPage < totalPages) {
      setCurrentPage(page => page+1);
      if (currentPage+1 === totalPages) {
        setShowMore(false)
      }
    }
  }

  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleFilter = () => {
    setLowStockOnly((prev) => !prev);
  };
  
  // Dynamically compute filtered stocks based on search query and filter state
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery);
    const matchesLowStock = !lowStockOnly || stock.stock < 10;
    return matchesSearch && matchesLowStock;
  });

  return (
    <div className="stock-dashboard">
      <h1 className="stock-dashboard__title">Stock Dashboard</h1>

      <div className="stock-dashboard__search">
        <input
          type="text"
          placeholder="Search products..."
          onChange={handleSearch}
        />
      </div>

      <div className="stock-dashboard__filter">
        <label>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={handleFilter}
          />
          Low-Stock Products
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Stock Quantity</th>
            <th>Low Stock?</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.name}</td>
              <td>{stock.stock}</td>
              <td>{stock.stock < 10 ? "Yes 🔴" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showMore && 
        <button onClick={incrementPage} className="stock-dashboard__more">Load More 
            <img src={arrow} alt="arrow" />
        </button>}
    </div>
  );
}

export default StockDashboard;
