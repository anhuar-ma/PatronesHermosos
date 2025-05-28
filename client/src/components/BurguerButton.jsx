import React from 'react';
import styled from 'styled-components';

function BurguerButton({ open }) {
    return (
        <Burguer>
            <div className={`hamburger ${open ? "is-active" : ""}`} id="hamburger-6">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>
        </Burguer>
    );
}

export default BurguerButton;

const Burguer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 2rem;

  .hamburger {
    width: 40px;
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .line {
    width: 100%;
    height: 4px;
    background-color: white;
    transition: transform 0.3s ease, opacity 0.3s ease;
    margin-left: 0;
  }
    /* Cambiar color cuando está activo */
.hamburger.is-active .line {
  background-color: #5d395a; /* o cualquier color que desees */
}

  @media (max-width: 767px) {
    margin-right: 0.5rem;
    .hamburger {
      width: 30px;
      height: 20px;
    }
    .line {
      height: 3px;

    }
    .is-active .hamburger {
      width: 20px;
    }
      
  }

  @media (max-width: 427px) {
    margin-right: 0rem;
  }
  /* Animación para transformar en "X" */
  .is-active .line:nth-child(1) {
    transform: translateY(0.7rem) rotate(45deg);
  }

  .is-active .line:nth-child(2) {
    opacity: 0;
  }

  .is-active .line:nth-child(3) {
    transform: translateY(-1rem) rotate(-45deg);
  }
`;
