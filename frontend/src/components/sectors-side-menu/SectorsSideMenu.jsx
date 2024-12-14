import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './sectorsSideMenu.scss';
import { LoadSectors } from '../../services/ProductService';

const SectorsSideMenu = ({ onFilter, filter }) => {
    const [sectors, setSectors] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        getSectors();
    }, []);

    const getSectors = async () => {
        const sectorsList = await LoadSectors();
        setSectors([{ name: 'All' }, ...sectorsList]);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Sectors Butonu */}
            <button
                className={`sectors__toggle ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
            >
                Sectors
            </button>

            {/* Sektör Menüsü */}
            <aside className={`sectors__menu ${isMenuOpen ? 'open' : ''}`}>
                {sectors.map((item) => {
                    const itemClasses = classNames('sectors__item', {
                        active: item.name === filter,
                    });
                    return (
                        <div
                            key={item.name}
                            className={itemClasses}
                            onClick={() => {
                                onFilter(item.name);
                                setIsMenuOpen(false); // Menü seçimden sonra kapanır
                            }}
                        >
                            {item.name}
                        </div>
                    );
                })}
            </aside>
        </>
    );
};

export default SectorsSideMenu;
