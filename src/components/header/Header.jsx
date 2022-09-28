import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
// import WalletConnect from "./WalletConnect";
import { FaInfo } from "react-icons/fa";

const Header = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 71) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  return (
    <>
      {/* Header */}
      <header className="main-header fixed-header">
          <div className="header-transparent position-relative d-flex justify-content-center">
            {/* Brand */}
            <div className="d-flex align-items-center logo-wrapper position-absolute">
              <NavLink to="/">
                <img
                  className="navbar-brand p-0 m-0"
                  src="/img/logo.png"
                  alt="brand logo"
                />
              </NavLink>
              <h5 className="brand-text text-white mb-0 ms-2">
                <b>GSWAP V2</b>
                <p className="mb-0 visiting-gomatoken"><a href="https://gomatoken.com" target="_blank" className="text-white mb-0"><small>visit GOMATOKEN.com</small></a></p>
              </h5>
            </div>
            <div className="text-center info-link-wrapper">
              <span className="info-icon">
                <FaInfo />
              </span>
              <a href="https://gomafinance.medium.com/goma-token-improvements-upgrade-to-v2-post-2-of-2-2a4915e43e42" className="text-white text-decoration-underline ms-2">Please read about the V2 Upgrade & Process</a>
            </div>
            <div className="right-section d-flex position-absolute">
              <a className="link-goma-fi" href="https://goma.fi" target="_blank">GOMA.fi</a>
              <div className="link-pancakeswap-wrapper">
                <div className="dropdown__heading">Buy on Pancakeswap</div>
                <a href="https://pancakeswap.finance/swap#/swap?outputCurrency=0x9ec55d57208cb28a7714a2ea3468bd9d5bb15125" className="btn btn-outline-white w-100" target="_blank">GET GOMA V2</a>
              </div>
            </div>
          </div>
      </header>
      {/* End Header */}
    </>
  );
};

export default Header;
