import React from 'react';
import './ConsultancyPage.scss';

function ConsultancyPage() {
    const sections = [
        {
            title: 'Smart City Technologies',
            description: `We are building the cities of the future today! With smart city technologies, we make cities more efficient, sustainable, and livable. From traffic
      management to energy savings, security solutions to environmental awareness, we offer a wide range of smart city solutions. By enabling the
      digital transformation of cities, we aim to improve both public services and the quality of life for citizens.`,
        },
        {
            title: 'Software Design Services',
            description: `We design functional and user-friendly software tailored to your needs. To optimize your business processes, enhance efficiency, and accelerate
      your digital transformation, we develop robust software solutions. With our industry-specific software, we simplify complex business processes
      and ensure that you progress confidently into the future.`,
        },
        {
            title: 'Hardware Design Services',
            description: `At the heart of technology, we produce hardware solutions tailored to your needs. With our advanced engineering approach, we design high-
      performance, reliable, and innovative hardware suitable for every industry. We analyze project requirements down to the finest details, offering
      customized solutions and elevating your business to the next level.`,
        },
        {
            title: 'Lighting Systems',
            description: `Our innovative lighting solutions combine energy efficiency and aesthetics to illuminate your spaces. We design and implement smart and
      sustainable lighting systems for both indoor and outdoor environments. In our lighting projects, we prioritize energy savings and long-lasting
      solutions.`,
        },
        {
            title: 'Factory Automation Systems',
            description: `Our factory automation solutions meet the requirements of Industry 4.0, making your production processes more efficient, faster, and error-
      free. While ensuring full control over production, we reduce your costs and give you a competitive edge. With integrated solutions that optimize
      all your processes, we prepare your factory for the future.`,
        },
    ];

    return (
        <div className="consultancy-page">
            <header className="hero">
                <h1>Consultancy & Project Development</h1>
            </header>
            <div className="content">
                {sections.map((section, index) => (
                    <section key={index} className="section">
                        <h2>{section.title}</h2>
                        <p>{section.description}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default ConsultancyPage;
