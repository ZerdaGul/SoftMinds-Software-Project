import React, { useEffect, useState } from "react";

import { LoadProducts } from "../../../services/ProductService";
import './stockDashboard.scss';

const stocksData = [
    {
      "product_id": "P001",
      "name": "Protein Powder",
      "stock_quantity": 15,
      "low_stock_indicator": true
    },
    {
      "product_id": "P002",
      "name": "Yoga Mat",
      "stock_quantity": 50,
      "low_stock_indicator": false
    },
    {
      "product_id": "P003",
      "name": "Dumbbells",
      "stock_quantity": 5,
      "low_stock_indicator": true
    },
    {
      "product_id": "P004",
      "name": "Resistance Bands",
      "stock_quantity": 25,
      "low_stock_indicator": false
    },
    {
      "product_id": "P005",
      "name": "Treadmill",
      "stock_quantity": 2,
      "low_stock_indicator": true
    },
    {
      "product_id": "P006",
      "name": "Exercise Ball",
      "stock_quantity": 30,
      "low_stock_indicator": false
    },
    {
      "product_id": "P007",
      "name": "Kettlebells",
      "stock_quantity": 10,
      "low_stock_indicator": true
    },
    {
      "product_id": "P008",
      "name": "Pull-Up Bar",
      "stock_quantity": 20,
      "low_stock_indicator": false
    },
    {
      "product_id": "P009",
      "name": "Resistance Loop Bands",
      "stock_quantity": 8,
      "low_stock_indicator": true
    },
    {
      "product_id": "P010",
      "name": "Foam Roller",
      "stock_quantity": 40,
      "low_stock_indicator": false
    }
  ]
  

function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState();
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    updateStocks();
  }, [currentPage]);

  const onError = (error) => {
      setError(true);  
      setShowModal(true);
      setErrorMessage(error.message)      
  }


  const updateStocks = async () => {
      try {
        const data = await LoadProducts({pageNumber:currentPage});
        setStocks(stocks => [...stocks, ...data.products]);
        setTotalPages(data.totalPages);
    } catch (error) {
        onError(error); // Handle error
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();

    if (query === "") {
      // Reset to the original stock data if the search field is cleared
      setStocks(stocksData);
    } else {
      // Filter based on the search query
      setStocks(
        stocksData.filter((stock) =>
          stock.name.toLowerCase().includes(query)
        )
      );
    }
  };

  const filteredStocks = lowStockOnly
    ? stocks.filter((stock) => stock.stock < 10)
    : stocks;

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
            <label >
                <input
                    
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={() => setLowStockOnly(!lowStockOnly)}
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
    </div>
  );
}

export default StockDashboard;
