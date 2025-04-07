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
  margin-left: 20px;

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
    transition: 0.3s ease-in-out;
  }


  .is-active .line:nth-child(2) {
    opacity: 0;
  }

  .is-active .line:nth-child(1) {
    transform: translateY(12px);
  }

  .is-active .line:nth-child(3) {
    transform: translateY(-12px) rotate(90deg);
  }
`;
