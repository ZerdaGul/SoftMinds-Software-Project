import React from 'react';
import './SolutionPage.scss';

function SolutionPage() {
    const sections = [
        {
            title: 'Project Contracting (Energy, Security, Factory, Lighting, Toll Collection)',
            description: `With our expert team, we offer solutions for energy, security, factory automation, lighting, and toll collection systems in project contracting. Our
      meticulously managed projects, from start to finish, aim to enhance your efficiency and simplify your business processes with sector-specific
      solutions. We deliver modern engineering and innovative technologies, creating future-proof and sustainable infrastructures.`,
        },
        {
            title: 'Electric Works',
            description: `We provide professional solutions for your electrical projects. From industrial facilities to commercial buildings, we specialize in the design,
      installation, and commissioning of electrical systems. Prioritizing safety, energy efficiency, and high performance, we enhance your electrical
      infrastructure with the latest technologies. We guarantee quality and customer satisfaction at every stage.`,
        },
        {
            title: 'ANPR and CCTV Camera Systems',
            description: `We offer the latest technology in ANPR (Automatic Number Plate Recognition) and CCTV camera systems for your security solutions. With high-
      resolution imaging, analysis, and recording capabilities, we meet your security needs at the highest level. While ANPR systems improve traffic
      management and security, our CCTV systems provide comprehensive surveillance. Our solutions are ideal for cities, commercial spaces, and
      industrial facilities.`,
        },
        {
            title: 'Smart City Systems',
            description: `Our smart city systems, which shape the future of cities, make urban life more efficient, safe, and sustainable. From smart traffic management
      and energy efficiency to environmental monitoring and security solutions, we offer comprehensive solutions that contribute to the digital
      transformation of cities. With smart city technologies, we aim to enhance the sustainability of cities and the quality of life for their residents.`,
        },
        {
            title: 'IoT (Internet of Things)',
            description: `With IoT technologies, we provide seamless connectivity between your devices and systems, optimizing your business processes. From
      production to energy management, and from security to agriculture, our IoT solutions enhance your business efficiency while reducing costs.
      With the Internet of Things, we offer smart, future-oriented solutions that enable you to make data-driven decisions.`,
        },
    ];

    return (
        <div className="solution-page">
            <header className="hero">
                <h1>Our Solutions</h1>
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

export default SolutionPage;
