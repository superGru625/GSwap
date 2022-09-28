import React from "react";
import Header from "../components/header/Header";
import TokenSwap from "../components/TokenSwap";
import useDocumentTitle from "../components/useDocumentTitle";

const Token = () => {
  useDocumentTitle("GSWAP");
  return (
    <>
      <Header />
      {/* End Header Section */}

      {/* Businesses */}
      <section id="token" className="section token-section">
        <div className="container">
          <TokenSwap />
        </div>
      </section>
      {/* End Businesses */}

      {/* Footer */}
      {/*<footer className="footer white">
        <div className="container">
          <Footer />
        </div>
      </footer>*/}
      {/*  End Footer */}
    </>
  );
};

export default Token;
