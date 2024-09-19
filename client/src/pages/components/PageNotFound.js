import React from "react";
import { Image } from "react-bootstrap";

const PageNotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center ">
      <Image src="/404.png" width={"100px"} alt="404 Page Not Found" />
      <h3>404-Page Not Found</h3>
    </div>
  );
};

export default PageNotFound;
