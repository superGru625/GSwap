import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";

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
      {/*<header className={navbar ? "main-header fixed-header" : "main-header"}>*/}
      <header className="main-header fixed-header">
        <nav className="container">
          <div className=" header-transparent">
            {/* Brand */}
            <NavLink to="/">
              Rating.Network Admin
            </NavLink>
            {/* / */}
            {/* Mobile Toggle */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleClick}
            >
              <div className={click ? "hamburger active" : "hamburger"}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            {/* / */}
            {/* Top Menu */}
            <div
              className={
                click
                  ? "mobile-menu justify-content-end active"
                  : "mobile-menu justify-content-end"
              }
            >
              <Link to="/" className="sidebar-logo">
                Rating.Network
              </Link>
              <Scrollspy
                className="anchor_nav navbar-nav ml-auto"
                items={["businesses", "howtowork", "faq", "contact"]}
                currentClassName="current"
                offset={-71}
              >
                <li>
                  <a className="nav-link" href="/admin/business" onClick={handleClick}>
                    <span>Businesses</span>
                  </a>
                </li>
                <li>
                  <a
                    className="nav-link"
                    href="/admin/review"
                    onClick={handleClick}
                  >
                    <span>Reviews</span>
                  </a>
                </li>
                <li>
                  <WalletConnect />
                </li>
              </Scrollspy>
              <button
                className=" sidebar-bottom-closer"
                type="button"
                onClick={handleClick}
              >
                Close Sidebar
              </button>
            </div>
            {/* / */}
          </div>
          {/* Container */}
        </nav>
        {/* Navbar */}
      </header>
      {/* End Header */}
    </>
  );
};

export default Header;
