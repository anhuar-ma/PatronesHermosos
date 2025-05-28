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
              <Link to="/"><img src="./src/assets/logo_patrones.png" alt="Logo patrones hermosos" className='logo' /></Link>
              <Link to="/" className='link-title'>
                <h1>
                    PATRONES <span>HERMOSOS</span>
                </h1>
              </Link> 
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
    gap: 0.4rem;
    z-index: 5;
  }

  img {
    width: 7rem;
    height: auto;
  }

  h1 {
    color: white;
    font-size: 2.0rem;
    white-space: nowrap;
    font-weight: bold;
  }
  .link-title {
    text-decoration: none;
  }

  span {
    color: white;
    display: block;
    font-weight: bold;
    margin-left: 1rem;
    font-size: 2rem;
  }
  .links {
      padding: 2rem 2rem;
      position: initial;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      background-color: rgba(162, 102, 158, 0.5); 
      width: 100%;
      border-radius: 10px;
      z-index: 10;
  }
  .link {
    color: white;
    text-decoration: none;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
      color: #f4a261;
      transform: scale(1.1);
    }
  }

  .links.active {
    top: 0px;
    opacity: 1;
    display: flex;
  }
  .burguer {
    display: block;
    cursor: pointer;
    z-index: 20;

    @media (min-width: 1025px) {
      display: none;
    }
  }
  @media (min-width: 1025px) {
    .links {
      margin-left: 2rem;
    }
  }
 
  @media (max-width: 1024px) {
    .links {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      background-color: rgba(162, 102, 158, 1);
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s ease, opacity 0.3s ease;
      z-index: 5;
      padding-top: 4rem;           
      gap: 4rem; 
      padding-left: 3rem;
    }
     
    .links.active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    h1 {
      color: white;

      font-weight: 400;
      white-space: nowrap;
      font-weight: bold;
    }
    span {
      color: white;
      display: block;
      font-weight: bold;
    }
    img {
      width: 7rem;
      height: auto;
    }
      @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @media (max-width: 767px) {
    h1 {
      color: white;
      font-weight: 400;
      white-space: nowrap;
      font-weight: bold;
    }
    span {
      color: white;
      display: block;
      font-weight: bold;
    }
  }
    .link {
      color: white;
      text-decoration: none;
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      opacity: 0;
      transform: translateX(-30px);
      transition: color 0.3s ease, transform 0.3s ease;
      animation: fadeInSlide 0.5s ease forwards;
    }

    /* Agrega esto solo cuando el menú está activo */
    .links.active .link:nth-child(1) {
      animation-delay: 0.1s;
    }
    .links.active .link:nth-child(2) {
      animation-delay: 0.2s;
    }
    .links.active .link:nth-child(3) {
      animation-delay: 0.3s;
    }
    .links.active .link:nth-child(4) {
      animation-delay: 0.4s;
    }
    
  }
  
`
