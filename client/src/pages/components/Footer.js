import React from "react";

const Footer = () => {
  return (
    <footer id="footers" className="footers position-relative light-background">
      <div className="containers copyright text-center mt-1">
        <p>
          © <span>Copyright</span>{" "}
          <strong className="px-1 sitename">Pigeon</strong>{" "}
          <span>All Rights Reserved</span>
        </p>
        <div className="credits">
          Designed by{" "}
          <a className="za" href="/">
            E Network
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
