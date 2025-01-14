import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarElement,
} from "chart.js";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import "./Dashboard.scss";
import geography from "../../../maps/world-countries.json";
import StockDashboard from "./StockDashboard";
import { getStockBySector, fetchMonthlyRevenue } from "../../../services/ProductAdminService";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement);

const OrderAdminDashboard = () => {
    const [stockBySector, setStockBySector] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    useEffect(() => {
        const getRevenueData = async () => {
            const revenueData = await fetchMonthlyRevenue();
            setMonthlyRevenue(revenueData);
            const total = revenueData.reduce((acc, curr) => acc + curr, 0);
            setTotalBalance(total);
        };
        const fetchStockBySector = async () => {
            const stockData = await getStockBySector();
            setStockBySector(stockData);
        };

        getRevenueData();
        fetchStockBySector();
    }, []);

    // Sektörlere göre stok durumu verisi
    const barChartData = {
        labels: stockBySector.map(item => item.sector),
        datasets: [
            {
                label: "Stock",
                data: stockBySector.map(item => item.stock),
                backgroundColor: "#7b3370",
            },
        ],
    };

    return (
        <div className="container">
            <div className="dashboard-content">                
                {/* Dünya haritası */}
                <div className="dashboard__summary">
                    <div id="map" className="summary__map">
                        <ComposableMap
                            projection="geoMercator"
                            projectionConfig={{
                                scale: 150,
                            }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <Geographies geography={geography}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            style={{
                                                default: { fill: "#EAEAEC", stroke: "#D6D6DA" },
                                                hover: { fill: "#F53", stroke: "#E42" },
                                                pressed: { fill: "#E42", stroke: "#F53" },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>

                    {/* Toplam bakiye */}
                    <div id='balance' className="summary__balance">
                    <h2>Total Balance</h2>
                    <p>${totalBalance.toLocaleString()}</p>
                    </div>

                    {/* Stok durumu */}
                    <div id='bar' className="summary__bar">
                        <h2>Product Stock</h2>
                        <Bar data={barChartData} />
                    </div>
                </div>
            </div>
            <StockDashboard/>
        </div>        
    );
};

export default OrderAdminDashboard;