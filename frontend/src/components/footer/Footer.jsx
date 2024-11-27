import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

import './footer.scss';
import logo from '../../assets/icons/logo-circle.svg';
import { LoadSectors } from '../../services/ProductService';


const Footer = () => {
    const [sectors, setSectors] = useState([]);

    useEffect(() => {
        getSectors();
    }, [])
    const getSectors= async() => {
        const sectorsList=await LoadSectors();
        setSectors(sectorsList);
    }


  return (
    <footer className="footer">
                <div className="container footer-content">
                    <Link to='/' className="footer-logo"><img src={logo} alt="logo-circle" /></Link>
                    <div className="footer-links">
                        <h3>Sectors</h3>
                        <ul>
                            {sectors.map(item => {
                                return (
                                    <li>
                                        <Link to={`/products`}
                                            state={{filter: item.name}}
                                            >{item.name}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h3>Follow Us</h3>
                        <ul>
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>YouTube</li>
                            <li>LinkedIn</li>
                        </ul>
                    </div>
                </div>
            </footer>
  )
}

export default Footer