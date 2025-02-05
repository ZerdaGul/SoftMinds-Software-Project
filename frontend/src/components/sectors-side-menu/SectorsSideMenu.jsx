import React from 'react'
import classNames from 'classnames';
import { useEffect } from 'react';
import './sectorsSideMenu.scss';
import { LoadSectors } from '../../services/ProductService';
import { useState } from 'react';


const SectorsSideMenu = ({onFilter, filter}) => {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    getSectors();
  }, [])
  const getSectors= async() => {
    const sectorsList=await LoadSectors();
    setSectors([{name: 'All'}, ...sectorsList]);
  }

  

  return (
    <aside className="sectors__menu">
        {sectors.map(item => {
            const itemClasses = classNames("sectors__item", {active: item.name===filter})
            return (
                <div key={item.name}
                    className={itemClasses}
                    onClick={()=>onFilter(item.name)}
                        >{item.name}</div>
            )
        })}
    </aside>
  )
}

export default SectorsSideMenu