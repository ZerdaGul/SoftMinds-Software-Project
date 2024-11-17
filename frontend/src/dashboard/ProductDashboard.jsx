import React from "react";
import { Line } from "react-chartjs-2";
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
    Marker,
} from "react-simple-maps";
import "./Dashboard.scss";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement);

const ProductDashboard = () => {
    // Aylık gelir grafiği verisi
    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Monthly Revenue",
                data: [20000, 45000, 70000, 90000, 120000, 150000, 170000, 200000, 180000, 150000, 120000, 100000],
                fill: false,
                borderColor: "#7b3370",
                tension: 0.1,
            },
        ],
    };

    // Harita üzerinde işaretlenecek ülkeler
    const customersLocations = [
        { name: "USA", coordinates: [-100.0, 40.0] },
        { name: "Germany", coordinates: [10.0, 51.0] },
        { name: "Japan", coordinates: [138.0, 36.0] },
    ];

    const barChartData = {
        labels: ["Smart City", "Energy", "ITS & Traffic", "Security & Surveillance", "Iron & Steel", "Packaging"],
        datasets: [
            {
                label: "Stock",
                data: [50, 80, 120, 60],
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
                    <h2>Global Performance</h2>
                    <ComposableMap>
                        <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
                            {({ geographies }) =>
                                geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
                            }
                        </Geographies>
                        {customersLocations.map(({ name, coordinates }) => (
                            <Marker key={name} coordinates={coordinates}>
                                <circle r={6} fill="#7b3370" />
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>

                {/* Toplam bakiye */}
                <div className="summary__balance">
                    <h2>Total Balance</h2>
                    <p>$2,548.00</p>
                </div>

                {/* Stok durumu */}
                <div className="summary__bar">
                    <h2>Product Stock</h2>
                    <Line data={barChartData} />
                </div>
            </div>
        </div>
    );
};

export default ProductDashboard;
