import React from 'react';
import './SectorPage.scss';

const sectors = [
    {
        name: "Smart Cities",
        consultancy: ["Consultancy & Project Development:", "Smart City Technologies", "Software Design Services", "Hardware Design Services"],
        solutions: ["Smart City Systems", "IoT"],
        products: ["ANPR and CCTV Camera Systems", "Sensors"],
    },
    {
        name: "Energy",
        consultancy: ["Consultancy & Project Development:", "Lighting Systems"],
        solutions: ["Project Contracting (Energy)", "Electric Works"],
        products: ["Electrical Panels", "Carbon Credits"],
    },
    {
        name: "ITS & Traffic",
        consultancy: ["Consultancy & Project Development:", "Hardware Design Services"],
        solutions: ["ANPR and CCTV Camera Systems", "Smart City Systems", "IoT"],
        products: ["ANPR and CCTV Camera Systems", "WIM (Weight In Motion) Systems"],
    },
    {
        name: "Security & Surveillance",
        consultancy: ["Consultancy & Project Development:", "Hardware Design Services"],
        solutions: ["Project Contracting (Security)", "ANPR and CCTV Camera Systems"],
        products: ["ANPR and CCTV Camera Systems", "Sensors"],
    },
    {
        name: "Iron & Steel",
        consultancy: ["Consultancy & Project Development:", "Factory Automation Systems"],
        solutions: ["Project Contracting (Factory)"],
        products: ["Zircon Refractory Bricks", "Iron & Steel Industry Spare Parts"],
    },
    {
        name: "Packaging",
        consultancy: ["Consultancy & Project Development:", "Hardware Design Services"],
        solutions: ["Project Contracting (Factory)"],
        products: ["PET Flake", "RFID Systems and Tags"],
    },
];

function SectorPage() {
    return (
        <div className="sector-page">
            <header className="hero">
                <h1>Sectors</h1>
            </header>
            <div className="sector-list">
                {sectors.map((sector, index) => (
                    <section key={index} className="sector">
                        <h2>{sector.name}</h2>
                        <div className="section-content">
                            <div className="consultancy">
                                <h3>Consultancy & Project Development</h3>
                                <ul>
                                    {sector.consultancy.slice(1).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="solutions">
                                <h3>Our Solutions</h3>
                                <ul>
                                    {sector.solutions.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="products">
                                <h3>Our Products</h3>
                                <ul>
                                    {sector.products.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default SectorPage;
