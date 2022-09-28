import React from "react";
import Social from "../Social";
import MintSection from "../mint/MintSection.jsx";

const Slider = () => {
  return (
    <>
      {/*  Home Banner */}
      <section
        id="home"
        className="home-banner overlay overlay-65"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "img/banner/bg.jpeg"
          })`,
        }}
      >
        <div className="frame-layout__particles"></div>
        {/* End particle animation */}
        <div className="container">
          <div className="row align-items-center full-screen">
            <div className="col-lg-12">
              <div className="hb-typo text-center">
                {/*<h1
                  className="font-alt"
                  data-aos="fade-up"
                  data-aos-duration="1200"
                  data-aos-delay="100"
                >
                  Rugged Rebellion
                </h1>*/}
                <MintSection />                
              </div>
            </div>
          </div>
        </div>
        {/* End .container */}

        {/*<div className="scroll-bottom go-to">
          <a href="#about">Scroll</a>
        </div>*/}

        {/* End bottom scroll */}

        <Social />
        {/* End social slide  */}
      </section>
      {/* End Home Banner  */}
    </>
  );
};

export default Slider;
