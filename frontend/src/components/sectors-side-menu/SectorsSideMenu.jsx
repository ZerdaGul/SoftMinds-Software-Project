import React from 'react'
import classNames from 'classnames';

import './sectorsSideMenu.scss'

const sectors = ['All', 'Smart City', 'Energy', 'ITS & Traffic', 'Security & Survellience', 'Iron & Steel', 'Packaging'];
const sectorsSideMenu = ({onFilter, filter}) => {
  return (
    <aside className="sectors__menu">
        {sectors.map(item => {
            const itemClasses = classNames("sectors__item", {active: item===filter})
            return (
                <div key={item}
                    className={itemClasses}
                    onClick={()=>onFilter(item)}
                        >{item}</div>
            )
        })}
    </aside>
  )
}

export default sectorsSideMenu