import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import geography from "../../../maps/world-countries.json";
import { fetchMonthlyRevenue } from "../../../services/ProductAdminService";

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

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement);

const ProductDashboard = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const getRevenueData = async () => {
      const revenueData = await fetchMonthlyRevenue();
      setMonthlyRevenue(revenueData);

      const total = revenueData.reduce((acc, curr) => acc + curr, 0);
      setTotalBalance(total);
    };

    getRevenueData();
  }, []);

    // Aylık gelir grafiği verisi
    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Monthly Revenue",
                data: monthlyRevenue,
                fill: false,
                borderColor: "#7b3370",
                tension: 0.1,
            },
        ],
    };

    // Stok durumu verisi
    const barChartData = {
        labels: ["Smart City", "Energy", "ITS & Traffic", "Security & Surveillance", "Iron & Steel", "Packaging"],
        datasets: [
            {
                label: "Stock",
                data: [50, 80, 120, 60, 90, 100],
                backgroundColor: "#7b3370",
            },
        ],
    };

    return (
        <div className="dashboard-content">
            {/* Üst kısımdaki line chart */}
            <div className="dashboard-content__chart">
                <h2>Monthly Performance</h2>
                <Line data={lineChartData} />
            </div>

            {/* Alt kısımda üç bölüm: Dünya haritası, toplam bakiye ve stok durumu */}
            <div className="dashboard-content__summary">
                {/* Dünya haritası */}
                <div className="summary__map">
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
                <div className="summary__balance">
                    <h2>Total Balance</h2>
                    <p>${totalBalance.toLocaleString()}</p>
                </div>

                {/* Stok durumu */}
                <div className="summary__bar">
                    <h2>Product Stock</h2>
                    <Bar data={barChartData} />
                </div>
            </div>
        </div>
    );
};

export default ProductDashboard;