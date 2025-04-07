import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import BurguerButton from './BurguerButton';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation(); 

    useEffect(() => {
        setMenuOpen(false); 
    }, [location.pathname]); 

    return (
        <NavContainer>
            <div className="logo-container">
                <img src="./src/assets/logo_patrones.png" alt="Logo patrones hermosos" />
                <h2>
                    PATRONES <span>HERMOSOS</span>
                </h2>
            </div>
            <div className={`links ${menuOpen ? 'active' : ''}`}>
                <Link to="/participante" className='link'>Registro participantes</Link>
                <Link to="/colaborador" className='link'>Registro colaboradores</Link>
                <Link to="/sede" className='link'>Registro sedes</Link>
                <Link to="/sesion" className='link'>Iniciar Sesión</Link>
            </div>
            <div className="burguer" onClick={() => setMenuOpen(!menuOpen)}>
                <BurguerButton open={menuOpen} />
            </div>
        </NavContainer>
    );
}

export default Navbar;


const NavContainer = styled.nav`
  padding: 0.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  img {
    width: 80px;
    height: auto;
  }

  h2 {
    color: white;
    font-weight: 400;
    white-space: nowrap;
  }

  span {
    color: white;
    display: block;
    font-weight: bold;
    margin-left: 30px;
    font-size: 1.3rem;
  }

  .links {
    position: absolute;
    top: -500px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    border-radius: 50px;
    background-color: rgba(162, 102, 158, 1); 
    padding: 1rem 0;
    opacity: 0;
    transition: opacity 0.5s ease, top 0.5s ease;
    z-index: 10;

    @media (min-width: 1024px) {
      padding: 1.4rem 2rem;
      position: initial;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      background-color: rgba(162, 102, 158, 1); 
      width: auto;
      opacity: 1;
      top: initial;
    }
  }

  .links.active {
    top: 60px;
    opacity: 1;
    display: flex;
  }

  .link {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #f4a261;
      transform: scale(1.1);
    }
  }

  .burguer {
    display: block;
    cursor: pointer;
    z-index: 20;

    @media (min-width: 1024px) {
      display: none;
    }
  }
`
