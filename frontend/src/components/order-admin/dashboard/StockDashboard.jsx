import React, { useEffect, useState } from "react";
import { LoadProducts, SearchProducts } from "../../../services/ProductService";
import "./stockDashboard.scss";
import arrow from "../../../assets/icons/arrow-forward-orange.svg";

function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch stocks based on the current state of searchQuery and pagination
    if (searchQuery) {
      fetchSearchResults();
    } else {
      fetchStocks();
    }
  }, [searchQuery, currentPage]);

  const fetchStocks = async () => {
    try {
      const data = await LoadProducts({ pageNumber: currentPage });
      if (Array.isArray(data.products)) {
        setStocks((prevStocks) =>
          currentPage === 1 ? data.products : [...prevStocks, ...data.products]
        );
        setTotalPages(data.totalPages);
      } else {
        console.error("Error: products is not an array");
        setStocks([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const data = await SearchProducts({
        keyword: searchQuery,
        pageNumber: currentPage,
      });
      if (Array.isArray(data.products)) {
        setStocks((prevStocks) =>
          currentPage === 1 ? data.products : [...prevStocks, ...data.products]
        );
        setTotalPages(data.totalPages);
      } else {
        console.error("Error: products is not an array");
        setStocks([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    setError(true);
    setErrorMessage(error.message || "Something went wrong!");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  const incrementPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1); // Reset to the first page
    setStocks([]); // Clear stocks to reload fresh data
  };

  const handleFilter = () => {
    setLowStockOnly((prev) => !prev);
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesLowStock = !lowStockOnly || stock.stock < 10;
    return matchesLowStock;
  });

  return (
    <div className="stock-dashboard">
      <h1 className="stock-dashboard__title">Stock Dashboard</h1>

      <div className="stock-dashboard__search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
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

      {error && (
        <div className="stock-dashboard__error">
          <p>{errorMessage}</p>
        </div>
      )}

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

      <div className="stock-dashboard__actions">
        {currentPage < totalPages && !error && (
          <button
            onClick={incrementPage}
            className="stock-dashboard__more"
            disabled={currentPage >= totalPages}
          >
            Load More
            <img src={arrow} alt="arrow" />
          </button>
        )}
        {currentPage === totalPages && totalPages>1 &&(
          <button
            onClick={resetPagination}
            className="stock-dashboard__more"
          >
            Show Less
            <img style={{rotate: '180deg'}}src={arrow} alt="arrow" />
          </button>
        )}
      </div>
    </div>
  );
}

export default StockDashboard;
