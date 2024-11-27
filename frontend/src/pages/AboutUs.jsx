import React from 'react';
import './AboutUs.scss';

function AboutUs() {
    return (
        <div className="about-us-page">
            {/* Hero Section */}
            <section className="hero">
                <h1>About us</h1>
            </section>

            {/* Who We Are Section */}
            <section className="who-we-are">
                <h2>Who we are</h2>
                <p>
                    As EKO Innovation & Trading S.L., we are a consultancy and project development firm operating in 6
                    different
                    sectors on an international scale. Our goal is to optimize business processes, reduce costs, and
                    develop
                    sustainable projects for the future by offering our clients the most innovative and efficient
                    solutions.
                </p>
                <p>
                    With our expert team, we provide advanced technology-based solutions in the fields of Smart Cities,
                    Energy,
                    Transportation & Traffic, Security & Surveillance, Iron & Steel, and Packaging.
                </p>
                <p>
                    In addition to our consultancy and project development services, we offer a wide range of products
                    within the
                    framework of international trade, including ANPR and CCTV Camera Systems, Data Centers, RFID Systems
                    and Tags,
                    Electrical Panels, Sensors, Zircon Refractory Bricks, PET Flake, Iron & Steel Industry Spare Parts,
                    and Carbon
                    Credits.
                </p>
                <p>
                    Our company prioritizes quality, safety, and sustainability in every project, aiming to provide the
                    best
                    service to our clients by closely following innovations and developments in the sector.
                </p>
                <a href="/sectors" className="link">More about our products &rarr;</a>
            </section>

            {/* Our Vision Section */}
            <section className="our-vision">
                <h2>Our vision</h2>
                <p>
                    To enhance the global competitiveness of our business partners through innovative solutions that promote
                    digital transformation and sustainability.
                </p>
            </section>

            {/* Our Mission Section */}
            <section className="our-mission">
                <h2>Our mission</h2>
                <p>
                    To develop projects that prioritize efficiency and sustainability in business processes by offering customized
                    solutions to meet our clients' needs.
                </p>
            </section>

            {/* Partners Section */}
            <section className="partners">
                <h2>Partners</h2>
                <div className="partner-cards">
                    <div className="partner-card">
                        <h3>Kamil Alpaydın</h3>
                        <p className="title">Co-founder</p>
                        <p>
                            Kamil has many years of experience in technology and engineering, with a specialization in Smart Cities,
                            Security, and Surveillance systems. His leadership in developing innovative projects has significantly
                            contributed to the company's growth and the production of technology-focused solutions.
                        </p>
                    </div>
                    <div className="partner-card">
                        <h3>Emre Baykal</h3>
                        <p className="title">Spain General Manager</p>
                        <p>
                            Emre possesses extensive experience in energy and automation systems. His expertise in energy projects,
                            factory automation, and data management allows him to deliver highly efficient solutions to clients. His
                            engineering and management skills play a critical role in the successful management of the company.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutUs;
