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
import geography from "../../../maps/world-countries.json";
import StockDashboard from "./StockDashboard";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement);

const OrderAdminDashboard = () => {
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
        <div className="container">
            <div className="dashboard-content">                
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
                    <p>$2,548.00</p>
                </div>

                {/* Stok durumu */}
                <div className="summary__bar">
                    <h2>Product Stock</h2>
                    <Line data={barChartData} />
                </div>
            </div>
            <StockDashboard/>
        </div>        
    );
};

export default OrderAdminDashboard;

